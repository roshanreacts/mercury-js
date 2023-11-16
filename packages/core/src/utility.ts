import _ from 'lodash';
import { fieldTypeMap } from './graphql';
export const historySchema = (name: string): TFields => {
  return {
    recordId: {
      type: 'relationship',
      ref: name,
    },
    operationType: {
      type: 'enum',
      enum: ['UPDATE', 'DELETE'],
      enumType: 'string',
      required: true,
    },
    instanceId: {
      type: 'string',
      required: true,
    },
    dataType: {
      type: 'string',
      required: true,
    },
    fieldName: {
      type: 'string',
      required: true,
    },
    newValue: {
      type: 'mixed',
      required: true,
    },
    oldValue: {
      type: 'mixed',
      required: true,
    },
  };
};

export const defaultTypeDefs = `
scalar DateTime
scalar EncryptString
scalar IntString
scalar EmailAddress
scalar NegativeFloat
scalar NegativeInt
scalar NonNegativeFloat
scalar NonNegativeInt
scalar NonPositiveFloat
scalar NonPositiveInt
scalar PhoneNumber
scalar PositiveFloat
scalar PositiveInt
scalar PostalCode
scalar UnsignedFloat
scalar UnsignedInt
scalar URL
scalar BigInt
scalar Long
scalar GUID
scalar HexColorCode
scalar HSL
scalar HSLA
scalar IPv4
scalar IPv6
scalar ISBN
scalar MAC
scalar Port
scalar RGB
scalar RGBA
scalar USCurrency
scalar JSON
scalar JSONObject
input whereID {
  is: ID
  isNot: ID
  in: [ID!]
  notIn: [ID!]
}

input whereString {
  is: String
  isNot: String
  contains: String
  notContains: String
  startsWith: String
  notStartWith: String
  endsWith: String
  notEndsWith: String
  isIn: [String]
  notIn: [String]
}

input whereInt {
  is: Int
  isNot: Int
  lt: Int
  lte: Int
  gt: Int
  gte: Int
  in: [Int]
  notIn: [Int]
}

input whereDateTime {
  is: String
  isNot: String
  lt: String
  lte: String
  gt: String
  gte: String
  in: [String]
  notIn: [String]
}

enum sort {
  asc
  desc
}
`;

export const whereInputCompose = (input: any, modelFields: TFields) => {
  let querySchema: any = {};
  _.mapKeys(input, (fieldReq: any, field: string) => {
    switch (field) {
      case 'AND':
        querySchema = {
          $and: _.map(fieldReq, (item) => whereInputCompose(item, modelFields)),
        };
        break;
      case 'OR':
        querySchema = {
          $or: _.map(fieldReq, (item) => whereInputCompose(item, modelFields)),
        };
        break;
      default:
        querySchema = whereInputMap(input, modelFields);
        break;
    }
  });
  return querySchema;
};

export const whereInputMap = (input: any, modelFields: TFields) => {
  const querySchema: any = {};
  _.mapKeys(input, (fieldReq: any, field: string) => {
    let key: string | undefined | any;
    if (field !== 'id') {
      key = fieldTypeMap[modelFields[field].type];
    } else {
      key = 'ID';
    }
    switch (key) {
      case 'ID':
        querySchema._id = _.has(fieldReq, 'is')
          ? { $eq: fieldReq.is }
          : _.has(fieldReq, 'isNot')
          ? { $ne: fieldReq.isNot }
          : _.has(fieldReq, 'in')
          ? { $in: fieldReq.in }
          : _.has(fieldReq, 'notIn')
          ? { $nin: fieldReq.notIn }
          : null;
        break;
      case 'relationship':
        querySchema[field] = _.has(fieldReq, 'is')
          ? { $eq: fieldReq.is }
          : _.has(fieldReq, 'isNot')
          ? { $ne: fieldReq.isNot }
          : _.has(fieldReq, 'in')
          ? { $in: fieldReq.in }
          : _.has(fieldReq, 'notIn')
          ? { $nin: fieldReq.notIn }
          : null;
        break;
      case 'String':
        querySchema[field] = _.has(fieldReq, 'is')
          ? { $eq: fieldReq.is }
          : _.has(fieldReq, 'isNot')
          ? { $ne: fieldReq.isNot }
          : _.has(fieldReq, 'contains')
          ? { $regex: `${fieldReq.contains}`, $options: 'i' }
          : _.has(fieldReq, 'notContains')
          ? { $regex: `^((?!${fieldReq.notContains}).)*$`, $options: 'i' }
          : _.has(fieldReq, 'startsWith')
          ? { $regex: `^${fieldReq.startsWith}`, $options: 'i' }
          : _.has(fieldReq, 'notStartWith')
          ? { $not: { $regex: `^${fieldReq.notStartWith}.*`, $options: 'i' } }
          : _.has(fieldReq, 'endsWith')
          ? { $regex: `.*${fieldReq.endsWith}$`, $options: 'i' }
          : _.has(fieldReq, 'notEndsWith')
          ? { $not: { $regex: `.*${fieldReq.notEndsWith}$`, $options: 'i' } }
          : _.has(fieldReq, 'in')
          ? { $in: fieldReq.in }
          : _.has(fieldReq, 'notIn')
          ? { $nin: fieldReq.notIn }
          : null;
        break;
      case 'enum':
        querySchema[field] = { $eq: fieldReq };
        break;
      case 'Boolean':
        querySchema[field] = { $eq: fieldReq };
        break;
      case 'Int':
      case 'DateTime':
        querySchema[field] = _.has(fieldReq, 'is')
          ? { $eq: fieldReq.is }
          : _.has(fieldReq, 'isNot')
          ? { $ne: fieldReq.isNot }
          : _.has(fieldReq, 'lt')
          ? { $lt: fieldReq.lt }
          : _.has(fieldReq, 'lte')
          ? { $lte: fieldReq.lte }
          : _.has(fieldReq, 'gt')
          ? { $gt: fieldReq.gt }
          : _.has(fieldReq, 'gte')
          ? { $gte: fieldReq.gte }
          : _.has(fieldReq, 'in')
          ? { $in: fieldReq.in }
          : _.has(fieldReq, 'notIn')
          ? { $nin: fieldReq.notIn }
          : null;
        break;
      default:
        break;
    }
  });
  return querySchema;
};

export const allowedSortFieldTypes = [
  'string',
  'number',
  'date',
  'enum',
  'boolean',
];
