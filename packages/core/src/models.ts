import { Schema, model as mongooseModel, models } from 'mongoose';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as mongooseBcrypt from 'mongoose-bcrypt';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as mongoosePaginateV2 from 'mongoose-paginate-v2';
import access from './access';
import hook from './hooks';
import { startCase } from 'lodash';
import { whereInputCompose } from './utility';

export class Model {
  public model: TModel;
  public mongoSchema: any;
  public mongoModel: any;
  // schema type map
  private fieldMongooseTyepMap: { [type: string]: any } = {
    string: Schema.Types.String,
    number: Schema.Types.Number,
    float: Schema.Types.Number,
    boolean: Schema.Types.Boolean,
    date: Schema.Types.Date,
    relationship: Schema.Types.ObjectId,
    enum: 'enum',
    mixed: Schema.Types.Mixed,
    objectId: Schema.Types.ObjectId,
    decimal: Schema.Types.Decimal128,
    bigint: Schema.Types.BigInt,
  };

  constructor(model: TModel) {
    this.model = model;
    // create mongo schema from fields
    this.mongoSchema = this.createSchema();
    this.addVirtualFields();
    this.mongoSchema.plugin(mongooseBcrypt.default);
    this.mongoSchema.plugin(mongoosePaginateV2.default);
    this.mongoModel =
      models[this.model.name] ||
      mongooseModel(this.model.name, this.mongoSchema);
    if (this.mongoSchema.indexes && this.mongoSchema.indexes.length > 0) {
      this.mongoModel.ensureIndexes();
    }
  }
  public async create(
    fields: any,
    user: CtxUser,
    options: any = { internal: true }
  ) {
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
    record = await record.save();
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

  public async update(
    id: string,
    fields: any,
    user: CtxUser,
    options: any = { internal: true }
  ) {
    // validate the access
    const hasAccess = access.validateAccess(
      this.model.name,
      'update',
      user,
      Object.keys(fields)
    );
    if (!hasAccess) {
      throw new Error(
        'You does not have access to perform this action on this record/ field.'
      );
    }
    let record = await this.mongoModel.findById(id);
    if (!record) {
      throw new Error('Record not found');
    }
    hook.execBefore(
      `UPDATE_${this.model.name.toUpperCase()}_RECORD`,
      {
        name: this.model.name,
        record,
        fields,
        user,
        options,
      },
      function (error: any) {
        if (error) {
          throw error;
        }
      }
    );
    const updateRecord = await this.mongoModel
      .findByIdAndUpdate(id, fields, { new: true })
      .exec();
    hook.execAfter(
      `UPDATE_${this.model.name.toUpperCase()}_RECORD`,
      null,
      {
        name: this.model.name,
        prevRecord: record,
        record: updateRecord,
        user,
        options,
      },
      function () {}
    );
    return updateRecord;
  }

  public async delete(id: string, user: CtxUser, options: any = {}) {
    // validate the access
    const hasAccess = access.validateAccess(
      this.model.name,
      'delete',
      user,
      []
    );
    if (!hasAccess) {
      throw new Error(
        'You does not have access to perform this action on this record/ field.'
      );
    }
    let record = await this.mongoModel.findById(id);
    if (!record) {
      throw new Error('Record not found');
    }
    hook.execBefore(
      `DELETE_${this.model.name.toUpperCase()}_RECORD`,
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
    record = await record.deleteOne();
    hook.execAfter(
      `DELETE_${this.model.name.toUpperCase()}_RECORD`,
      null,
      {
        name: this.model.name,
        record,
        user,
        options,
      },
      function () {}
    );
    return true;
  }

  public async get(query: Object, user: CtxUser, options: any = {}) {
    // validate the access
    const hasAccess = access.validateAccess(this.model.name, 'read', user, []);
    if (!hasAccess) {
      throw new Error(
        'You does not have access to perform this action on this record/ field.'
      );
    }
    // compose query from where input
    let record = await this.mongoModel.findOne(query).exec();
    if (!record) {
      throw new Error('Record not found');
    }
    hook.execBefore(
      `GET_${this.model.name.toUpperCase()}_RECORD`,
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
    hook.execAfter(
      `GET_${this.model.name.toUpperCase()}_RECORD`,
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

  public async list(query: Object, user: CtxUser, options: any = {}) {
    // validate the access
    const hasAccess = access.validateAccess(this.model.name, 'read', user, []);
    if (!hasAccess) {
      throw new Error(
        'You does not have access to perform this action on this record/ field.'
      );
    }
    let records = await this.mongoModel.find(query);
    hook.execBefore(
      `LIST_${this.model.name.toUpperCase()}_RECORD`,

      {
        name: this.model.name,
        records,
        user,
        options,
      },
      function (error: any) {
        if (error) {
          throw error;
        }
      }
    );
    hook.execAfter(
      `LIST_${this.model.name.toUpperCase()}_RECORD`,
      null,
      {
        name: this.model.name,
        records,
        user,
        options,
      },
      function () {}
    );
    return records;
  }

  public async paginate(
    query: Object,
    filters: Object,
    user: CtxUser,
    options: any = {}
  ) {
    // validate the access
    const hasAccess = access.validateAccess(this.model.name, 'read', user, []);
    if (!hasAccess) {
      throw new Error(
        'You does not have access to perform this action on this record/ field.'
      );
    }
    let records = await this.mongoModel.paginate(query, filters);
    hook.execBefore(
      `LIST_${this.model.name.toUpperCase()}_RECORD`,

      {
        name: this.model.name,
        records,
        user,
        options,
      },
      function (error: any) {
        if (error) {
          throw error;
        }
      }
    );
    hook.execAfter(
      `LIST_${this.model.name.toUpperCase()}_RECORD`,
      null,
      {
        name: this.model.name,
        records,
        user,
        options,
      },
      function () {}
    );
    return records;
  }

  public async count(user: CtxUser, options: any = {}) {
    // validate the access
    const hasAccess = access.validateAccess(this.model.name, 'read', user, []);
    if (!hasAccess) {
      throw new Error(
        'You does not have access to perform this action on this record/ field.'
      );
    }
    let count = await this.mongoModel.countDocuments();
    hook.execBefore(
      `COUNT_${this.model.name.toUpperCase()}_RECORD`,
      {
        name: this.model.name,
        count,
        user,
        options,
      },
      function (error: any) {
        if (error) {
          throw error;
        }
      }
    );
    hook.execAfter(
      `COUNT_${this.model.name.toUpperCase()}_RECORD`,
      null,
      {
        name: this.model.name,
        count,
        user,
        options,
      },
      function () {}
    );
    return count;
  }

  // Mogoose schema generator
  private createSchema() {
    return new Schema(
      Object.keys(this.model.fields)
        .map((key) => {
          const value = this.model.fields[key];
          // ignore the virtual fields
          if (value.type === 'virtual') {
            return;
          }
          const fieldSchema: {
            type: any;
            ref?: string;
            enum?: Array<string | number>;
            bcrypt?: boolean;
            rounds?: number;
            unique?: boolean;
            required?: boolean;
          } = {
            type: this.fieldMongooseTyepMap[value.type],
          };
          if ('required' in value) {
            fieldSchema['required'] = value.required;
          }
          if ('unique' in value) {
            fieldSchema['unique'] = value.unique;
          }
          if ('ref' in value) {
            fieldSchema['ref'] = value.ref;
          }
          if ('enum' in value && value.enumType) {
            fieldSchema.type = this.fieldMongooseTyepMap[value.enumType];
            fieldSchema.enum = value.enum;
          }
          if ('bcrypt' in value) {
            fieldSchema.bcrypt = value.bcrypt;
          }
          return { [key]: fieldSchema };
        })
        .filter((item) => {
          if (item !== null) {
            return item;
          }
        }),
      {
        timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' },
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
      }
    );
  }

  public verifyBcryptField(
    model: any,
    fieldName: string,
    password: string,
    user: CtxUser
  ) {
    const hasAccess = access.validateAccess(this.model.name, 'read', user, []);
    if (!hasAccess) {
      throw new Error(
        'You does not have access to perform this action on this record/ field.'
      );
    }
    const methodName = `verify${startCase(fieldName)}`.replace(/\s/g, '');
    return model[methodName](password);
  }

  private addVirtualFields() {
    Object.entries(this.model.fields)
      .filter(
        ([fieldName, fieldObj]: [fieldName: string, fieldObj: TField]) =>
          fieldObj.type === 'virtual'
      )
      .forEach(([fieldName, fieldObj]) =>
        this.mongoSchema.virtual(fieldName, {
          ref: fieldObj.ref, // the model to use
          localField: fieldObj.localField, // find children where 'localField'
          foreignField: fieldObj.foreignField, // is equal to foreignField
          justOne: fieldObj.justOne,
        })
      );
  }
}
