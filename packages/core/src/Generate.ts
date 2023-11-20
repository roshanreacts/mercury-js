import _ from 'lodash';
import { Schema, model, models } from 'mongoose';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as mongooseBcrypt from 'mongoose-bcrypt';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as mongoosePaginateV2 from 'mongoose-paginate-v2';
import Resolvers from './Resolvers';

const fieldsTypeMap = [
  { type: 'ID', value: 'ID' },
  { type: 'string', value: 'String' },
  { type: 'number', value: 'Int' },
  { type: 'boolean', value: 'Boolean' },
  { type: 'float', value: 'Float' },
  { type: 'enum', value: 'enum' },
  { type: 'date', value: 'DateTime' },
  { type: 'relationship', value: 'relationship' },
  { type: 'virtual', value: 'virtual' },
];

const mongoFieldsTypeMap = [
  { type: 'string', value: 'String' },
  { type: 'number', value: 'Number' },
  { type: 'float', value: Schema.Types.Decimal128 },
  { type: 'boolean', value: 'Boolean' },
  { type: 'date', value: 'Date' },
  { type: 'enum', value: 'enum' },
  { type: 'relationship', value: Schema.Types.ObjectId },
  { type: 'ID', value: Schema.Types.ObjectId },
];

class Generate {
  _mercury: Mercury;
  schema: schemaType;
  adapter: DbAdapter;
  modelName: string;
  modelFields: FieldsMap;
  genSchema: Array<string>;
  addGrpahqlSchema: string[];
  constructor(schema: schemaType, mercury: Mercury) {
    this._mercury = mercury;
    this.schema = schema;
    this.adapter = mercury.adapter;
    this.modelName = schema._model;
    this.modelFields = schema.fields;
    this.genSchema = [];
    this.addGrpahqlSchema = [];
    if (schema.typeDefs) {
      this.addGrpahqlSchema.push(schema.typeDefs);
    }
  }

  Resolvers(): Resolvers {
    return new Resolvers(this);
  }

  grpahqlSchema() {
    const queries: Array<string> = [];
    const mutation: Array<string> = [];

    this.genSchema.push(``);

    // ********* Generate Queries **********
    this.genSchema.push(`type Query {`);
    // get All of the Model
    this.genSchema.push(
      `  all${this.modelName}s(where: where${this.modelName}Input, sort: sort${this.modelName}Input = {},offset: Int! = 0, limit: Int! = 10): ${this.modelName}Pagination`
    );
    // get one item from the model
    this.genSchema.push(
      `  get${this.modelName}(where: where${this.modelName}Input): ${this.modelName}`
    );
    this.genSchema.push(`}`);
    this.genSchema.push(``);

    // Queries sortInput types
    this.genSchema.push(`input sort${this.modelName}Input {`);
    _.mapKeys(this.modelFields, (fieldObj, fieldName) => {
      const isRead = fieldObj.ignoreGraphql
        ? fieldObj.ignoreGraphql.read
        : false;
      if (!isRead) {
        const allowedSortKeyTypes = [
          'string',
          'number',
          'date',
          'enum',
          'boolean',
        ];
        if (allowedSortKeyTypes.includes(fieldObj.type)) {
          this.genSchema.push(`  ${fieldName}: sort`);
        }
      }
    });
    this.genSchema.push(`  createdOn: sort`);
    this.genSchema.push(`  updatedOn: sort`);
    this.genSchema.push(`}`);
    this.genSchema.push(``);

    // Queries whereInput types
    this.genSchema.push(`input where${this.modelName}Input {`);
    this.genSchema.push(this.generateWhereInput('id', 'ID'));
    _.mapKeys(this.modelFields, (fieldObj, fieldName) => {
      const isRead = fieldObj.ignoreGraphql
        ? fieldObj.ignoreGraphql.read
        : false;
      if (!isRead) {
        const fieldType = this.getFieldType(fieldObj.type);
        if (fieldType && typeof fieldType == 'string') {
          this.genSchema.push(this.generateWhereInput(fieldName, fieldType));
        }
      }
    });
    this.genSchema.push(`  AND: [where${this.modelName}Input]`);
    this.genSchema.push(`  OR: [where${this.modelName}Input]`);
    this.genSchema.push(`}`);
    this.genSchema.push(``);

    // ********* Declare Model Pagination type **********
    this.genSchema.push(`type ${this.modelName}Pagination {`);
    this.genSchema.push(`  docs: [${this.modelName}]`);
    this.genSchema.push(`  totalDocs: Int`);
    this.genSchema.push(`  offset: Int`);
    this.genSchema.push(`  limit: Int`);

    // Close Pagination type
    this.genSchema.push(`}`);
    this.genSchema.push(``);

    // Queries
    queries.push(`all${this.modelName}s`);
    queries.push(`get${this.modelName}`);

    // ********* Generate Mutations **********
    this.genSchema.push(`type Mutation {`);
    // mutate model with Create, Update, Delete
    this.genSchema.push(
      `  create${this.modelName}(data: create${this.modelName}Input!): ${this.modelName}`
    );
    this.genSchema.push(
      `  create${this.modelName}s(data: [create${this.modelName}Input!]!): [${this.modelName}]`
    );
    this.genSchema.push(
      `  update${this.modelName}(id: ID!, data: update${this.modelName}Schema!): ${this.modelName}`
    );
    this.genSchema.push(
      `  update${this.modelName}s(data: [update${this.modelName}Input!]!): [${this.modelName}]`
    );
    this.genSchema.push(`  delete${this.modelName}(id: ID!): Boolean`);
    this.genSchema.push(`  delete${this.modelName}s(ids: [ID!]): Boolean`);
    this.genSchema.push(`}`);
    this.genSchema.push(``);

    // Mutations
    mutation.push(`create${this.modelName}`);
    mutation.push(`create${this.modelName}s`);
    mutation.push(`update${this.modelName}`);
    mutation.push(`update${this.modelName}s`);
    mutation.push(`delete${this.modelName}`);
    mutation.push(`delete${this.modelName}s`);

    // ********* Declare Model type **********
    this.genSchema.push(`type ${this.modelName} {`);
    // Add Id
    this.genSchema.push(`  id: ID!`);

    _.mapKeys(
      this.modelFields,
      (fieldObj: { [key: string]: any }, fieldName: string) => {
        const isRead = fieldObj.ignoreGraphql
          ? fieldObj.ignoreGraphql.read
          : false;
        if (!isRead) {
          const fieldType = fieldObj.graphqlType
            ? fieldObj.graphqlType
            : this.getGraphqlField(fieldObj, fieldName);
          if (fieldType) {
            this.genSchema.push(`  ${fieldName}: ${fieldType}`);
          }
        }
      }
    );

    // Extend type for model type
    const ele = _.find(
      this.schema.extendType,
      (field) => field.type === this.modelName
    );
    if (this.schema.extendType && ele) {
      this.genSchema.push(ele?.definition);
    }

    // Close type
    this.genSchema.push(`}`);
    this.genSchema.push(``);

    // ********* Declare Model Input type **********
    this.genSchema.push(`input create${this.modelName}Input {`);
    _.mapKeys(this.modelFields, (fieldObj, fieldName) => {
      const fieldType = fieldObj.graphqlType
        ? fieldObj.graphqlType
        : this.getGraphqlField(fieldObj, fieldName, 'create');
      if (fieldType) {
        this.genSchema.push(
          `  ${fieldName}: ${fieldType}${fieldObj.isRequired ? '!' : ''}`
        );
      }
    });
    // Close input type
    this.genSchema.push(`}`);

    // ********* Declare Model Update Input type **********
    this.genSchema.push(`input update${this.modelName}Schema {`);
    _.mapKeys(this.modelFields, (fieldObj, fieldName) => {
      const fieldType = fieldObj.graphqlType
        ? fieldObj.graphqlType
        : this.getGraphqlField(fieldObj, fieldName, 'update');
      if (fieldType) {
        this.genSchema.push(`  ${fieldName}: ${fieldType}`);
      }
    });
    // Close input type
    this.genSchema.push(`}`);

    // Update Input
    this.genSchema.push(``);
    this.genSchema.push(`input update${this.modelName}Input {`);
    this.genSchema.push(`  id: ID!`);
    this.genSchema.push(`  data: update${this.modelName}Schema!`);
    this.genSchema.push(`}`);

    return {
      schema: this.arrToString(_.concat(this.genSchema, this.addGrpahqlSchema)),
      query: queries,
      mutation: mutation,
    };
  }

  getGraphqlField(
    field: { [key: string]: any },
    fieldName: string,
    schemaType: string = 'query'
  ) {
    switch (field.type) {
      case 'ID':
      case 'string':
      case 'boolean':
      case 'number':
      case 'float':
      case 'date':
        return field.many
          ? `[${this.getFieldType(field.type)}]`
          : this.getFieldType(field.type);
        break;
      case 'enum':
        // Push enum values to schema and create a type
        if (
          !_.includes(
            this.addGrpahqlSchema,
            `enum ${this.modelName}${fieldName.toProperCase()}EnumType {`
          )
        ) {
          this.addGrpahqlSchema.push(``);
          this.addGrpahqlSchema.push(
            `enum ${this.modelName}${fieldName.toProperCase()}EnumType {`
          );
          _.map(field.enum, (key) => {
            this.addGrpahqlSchema.push(`  ${key}`);
          });
          this.addGrpahqlSchema.push(`}`);
          this.addGrpahqlSchema.push(``);
        }
        return `${this.modelName}${fieldName.toProperCase()}EnumType`;
        break;
      case 'date':
        return this.getFieldType(field.type);
        break;
      case 'password':
        if (schemaType !== 'query') {
          return `String`;
        }
        return;
        break;
      case 'relationship':
      case 'virtual':
        if (schemaType === 'create') {
          return field.many ? `[String]` : `String`;
        }
        if (schemaType === 'update') {
          return field.many ? `[String]` : `String`;
        }
        return field.many ? `[${field.ref}]` : field.ref;
        break;
      default:
        break;
    }
  }

  getFieldType(fieldType: string, ref: 'gql' | 'mongo' = 'gql') {
    let refType;
    if (ref === 'gql') refType = fieldsTypeMap;
    if (ref === 'mongo') refType = mongoFieldsTypeMap;
    return _.find(refType, ['type', fieldType])?.value;
  }

  arrToString(arr: Array<string>) {
    let genString = '';
    _.map(arr, (line) => {
      genString += line;
      genString += '\n';
    });

    return genString;
  }

  generateWhereInput(Field: string, type: string) {
    switch (type) {
      case 'ID':
      case 'relationship':
        return `  ${Field}: whereID`;
        break;

      case 'String':
        return `  ${Field}: whereString`;
        break;

      case 'Int':
        return `  ${Field}: whereInt`;
        break;

      case 'DateTime':
        return `  ${Field}: whereDateTime`;
        break;

      case 'Float':
        return `  ${Field}: whereInt`;
        break;

      case 'Boolean':
        return `  ${Field}: Boolean`;
        break;

      case 'enum':
        return `  ${Field}: ${this.modelName}${Field.toProperCase()}EnumType`;
        break;

      default:
        return ``;
        break;
    }
  }

  graphqlResolver(
    queries: Array<string>,
    mutation: Array<string>,
    dbModel: any
  ): ModelResolvers {
    let Query: any = {};
    let Mutation: any = {};

    //   Queries
    _.map(queries, (query) => {
      Query[query] = this.Resolvers().mapMongoResolver(query, dbModel);
    });

    //   Mutations
    _.map(mutation, (mutate) => {
      Mutation[mutate] = this.Resolvers().mapMongoResolver(mutate, dbModel);
    });
    return { Query, Mutation };
  }

  // Mongoose model generator
  mongoModel() {
    const mongoSchemaObj: any = {};
    const virtualFields: Array<{
      fieldName: string;
      fieldObj: { [key: string]: any };
    }> = [];
    _.mapKeys(this.modelFields, (fieldObj, fieldName) => {
      if (this.getFieldType(fieldObj.type, 'mongo')) {
        const fieldSchema: any = {
          type:
            this.getFieldType(fieldObj.type, 'mongo') === 'enum' &&
            fieldObj.enumType
              ? this.getFieldType(fieldObj.enumType, 'mongo')
              : this.getFieldType(fieldObj.type, 'mongo'),
        };

        if (_.has(fieldObj, 'isRequired'))
          fieldSchema.required = fieldObj.isRequired;
        if (_.has(fieldObj, 'unique')) fieldSchema.unique = fieldObj.unique;
        if (_.has(fieldObj, 'default')) fieldSchema.default = fieldObj.default;
        if (_.has(fieldObj, 'ref')) fieldSchema.ref = fieldObj.ref;
        if (_.has(fieldObj, 'enum')) fieldSchema.enum = fieldObj.enum;
        mongoSchemaObj[fieldName] =
          _.has(fieldObj, 'many') && fieldObj.many
            ? [fieldSchema]
            : fieldSchema;
      }
      if (fieldObj.type === 'virtual') {
        virtualFields.push({ fieldName, fieldObj });
      }
    });

    const newSchema = new Schema(mongoSchemaObj, {
      timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' },
      toObject: { virtuals: true },
      toJSON: { virtuals: true },
    });

    // Add virtuals to schema
    _.map(virtualFields, (item) => {
      newSchema.virtual(item.fieldName, {
        ref: item.fieldObj.ref, // the model to use
        localField: item.fieldObj.localField, // find children where 'localField'
        foreignField: item.fieldObj.foreignField, // is equal to foreignField
        justOne: item.fieldObj.justOne,
      });
    });
    if (this.schema.indexes && this.schema.indexes.length > 0) {
      this.schema.indexes.map((index: any) => {
        newSchema.index(index.fields, index.options);
      });
    }
    // Add option to include custom plugins
    newSchema.plugin(mongooseBcrypt.default);
    newSchema.plugin(mongoosePaginateV2.default);
    const newModel = models[this.modelName] || model(this.modelName, newSchema);
    if (this.schema.indexes && this.schema.indexes.length > 0) {
      newModel.ensureIndexes();
    }
    return {
      newSchema,
      newModel,
    };
  }
}

export default Generate;
