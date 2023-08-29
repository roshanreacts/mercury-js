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
      isRequired: true,
    },
    instanceId: {
      type: 'string',
      isRequired: true,
    },
    dataType: {
      type: 'string',
      isRequired: true,
    },
    fieldName: {
      type: 'string',
      isRequired: true,
    },
    newValue: {
      type: 'string',
      isRequired: true,
    },
    oldValue: {
      type: 'string',
      isRequired: true,
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
`;
