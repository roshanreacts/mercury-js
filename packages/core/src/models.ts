import { Schema, model as mongooseModel } from 'mongoose';
import access from './access';
import hook from './hooks';

export class Model {
  private model: TModel;
  private mongoSchema: any;
  private mongoModel: any;
  // schema type map
  private fieldMongooseTyepMap: { [type: string]: any } = {
    string: Schema.Types.String,
    number: Schema.Types.Number,
    boolean: Schema.Types.Boolean,
    date: Schema.Types.Date,
    relationship: Schema.Types.ObjectId,
    enum: 'enum',
  };

  constructor(model: TModel) {
    this.model = model;
    // create mongo schema from fields
    this.mongoSchema = this.createSchema();
    this.mongoModel = mongooseModel(model.name, this.mongoSchema);
  }
  public async create(fields: any, user: CtxUser, options = {}) {
    // validate the access
    const hasAccess = access.validateAccess(
      this.model.name,
      'create',
      user,
      Object.keys(fields)
    );
    if (!hasAccess) {
      throw new Error(
        'You does not have access to perform this action on this record/ field.'
      );
    }
    let record = new this.mongoModel(fields);
    hook.execBefore(
      `CREATE_${this.model.name.toUpperCase()}_RECORD`,
      {
        name: this.model.name,
        record,
        user,
        options,
      },
      function (error: any) {
        if (error) {
          throw error;
        }
      }
    );
    // record = await record.save();
    hook.execAfter(
      `CREATE_${this.model.name.toUpperCase()}_RECORD`,
      null,
      {
        name: this.model.name,
        record,
        user,
        options,
      },
      function () {}
    );
    return record;
  }
  private createSchema() {
    return new Schema(
      Object.keys(this.model.fields).map((key) => {
        const value = this.model.fields[key];
        const fieldSchema: {
          type: any;
          ref?: string;
          enum?: Array<string | number>;
        } = {
          type: this.fieldMongooseTyepMap[value.type],
        };
        if ('ref' in value) {
          fieldSchema['ref'] = value.ref;
        }
        if ('enum' in value && value.enumType) {
          fieldSchema.type = this.fieldMongooseTyepMap[value.enumType];
          fieldSchema.enum = value.enum;
        }
        return { [key]: fieldSchema };
      })
    );
  }
}
