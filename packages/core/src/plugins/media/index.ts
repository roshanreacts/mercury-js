import type { Mercury } from '../../mercury';
import { GraphQLError } from 'graphql';
import _ from 'lodash';
import { AfterHook } from '../../packages/platform/utility';
import type { Platform } from '../../packages/platform';
import { decodeBase64Image } from './utils';
import cloudinary from 'cloudinary';
import { File } from './models/file';
import { Ecommerce } from 'src/packages/ecommerce';

interface MediaConfig {
  CLOUDINARY_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
}
interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  resource_type: string;
  bytes: number;
}
export default (options: MediaConfig) => {
  return (ecommerce: Ecommerce) => {
    const media = new Media(ecommerce, options);
    media.run();
  };
};

class Media {
  public mercury: Mercury;
  public ecommerce: Ecommerce;
  public platform: Platform;
  public options: MediaConfig;
  constructor(ecommerce: Ecommerce, options: MediaConfig) {
    this.mercury = ecommerce.platform.mercury;
    this.platform = ecommerce.platform;
    this.ecommerce = ecommerce;
    this.options = options;
    this.createFileModel();
    this.addFileDeleteHook();
    cloudinary.v2.config({
      cloud_name: options?.CLOUDINARY_NAME,
      api_key: options?.CLOUDINARY_API_KEY,
      api_secret: options?.CLOUDINARY_API_SECRET,
    });
  }

  @AfterHook
  run() {
    try {
      this.mercury.addGraphqlSchema(
        `
          type Mutation {
            uploadfile(base64File:String,fileName:String,description:String):uploadResponse,
            updatefile(fileId: String, base64File: String,fileName: String, description: String):updateResponse
          }
            type uploadResponse{
                file:String
                message:String
            }
      type updateResponse{
        message:String
      }
        `,
        {
          Mutation: {
            uploadfile: async (
              root: any,
              {
                base64File,
                fileName,
                description,
              }: { base64File: string; fileName: string; description: string },
              ctx: any
            ) => {
              const fileData = decodeBase64Image(base64File);
              const uploadResult = await new Promise<CloudinaryUploadResult>(
                (resolve, reject) => {
                  const uploadStream = cloudinary.v2.uploader.upload_stream(
                    { resource_type: 'auto', public_id: fileName },
                    (error: any, result: any) => {
                      if (error) {
                        console.log("------------------------", error);
                        
                        reject(new GraphQLError('File upload failed'));
                      }
                      resolve(result);
                    }
                  );
                  uploadStream.end(fileData);
                }
              );
              const mercuryDBInstance = this.platform.mercury.db;

              const newFileRecord = await mercuryDBInstance.File.create(
                {
                  name: fileName,
                  mediaId: uploadResult.public_id,
                  description: description,
                  mimeType: uploadResult.resource_type,
                  extension: fileName.split('.').pop() || 'png',
                  size: uploadResult.bytes,
                  location: uploadResult.secure_url,
                },
                ctx?.user
              );

              return {
                message: 'File uploaded successfully',
                file: newFileRecord._id,
              };
            },
            updatefile: async (
              root: any,
              {
                fileId,
                base64File,
                fileName,
                description,
              }: {
                fileId: string;
                base64File: string;
                fileName: string;
                description: string;
              },
              ctx: any
            ) => {
              const mercuryDBInstance = this.platform.mercury.db;
              const fileRecord = await mercuryDBInstance.File.get(
                { _id: fileId },
                ctx?.user
              );

              if (!fileRecord?.id) {
                throw new GraphQLError('File record not found in the database');
              }

              const publicId = fileRecord?.mediaId;
              console.log('Deleting old file from Cloudinary:', publicId);
              await new Promise<any>((resolve, reject) => {
                cloudinary.v2.uploader.destroy(
                  publicId,
                  (error: any, result: any) => {
                    if (error) {
                      reject(
                        new GraphQLError(
                          'Failed to delete  file from Cloudinary'
                        )
                      );
                    }
                    resolve(result);
                  }
                );
              });

              const fileData = decodeBase64Image(base64File);
              const uploadResult = await new Promise<CloudinaryUploadResult>(
                (resolve, reject) => {
                  const uploadStream = cloudinary.v2.uploader.upload_stream(
                    { resource_type: 'auto', public_id: fileName },
                    (error: any, result: any) => {
                      if (error) {
                        reject(new GraphQLError('New file upload failed'));
                      }
                      resolve(result);
                    }
                  );
                  uploadStream.end(fileData);
                }
              );

              const updatedFileRecord = await mercuryDBInstance.File.update(
                fileRecord._id,
                {
                  name: fileName,
                  mediaId: uploadResult.public_id,
                  description: description,
                  mimeType: uploadResult.resource_type,
                  extension: fileName.split('.').pop() || 'png',
                  size: uploadResult.bytes / 1024,
                  location: uploadResult.secure_url,
                },
                ctx?.user
              );

              return {
                message: 'File updated successfully',
              };
            },
          },
        }
      );
    } catch (error: any) {
      return new GraphQLError(error?.message);
    }
  }

  public createFileModel() {
    if (!(File.info.name in this.mercury.db))
      this.platform.createModel(File);
  }

  public addFileDeleteHook() {
    const thisPlatform = this.platform;
    this.platform.mercury.hook.before(
      'DELETE_FILE_RECORD',
      async function (this: any) {
        const mercuryDBInstance = thisPlatform.mercury.db;

        const fileRecord = await mercuryDBInstance.File.get(
          { _id: this.options.args.id },
          this?.user
        );

        const publicId = fileRecord.mediaId;
        await new Promise<any>((resolve, reject) => {
          cloudinary.v2.uploader.destroy(
            publicId,
            (error: any, result: any) => {
              if (error) {
                reject(
                  new GraphQLError('Failed to delete file from Cloudinary')
                );
              }
              resolve(result);
            }
          );
        });
      }
    );
  }
}
