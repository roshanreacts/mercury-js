import { Mercury } from '../../../mercury';

let mercury = new Mercury();

export const LeadSchema: any = () => {
  mercury.createModel('Lead', {
    address: {
      type: 'string',
    },
    annualRevenue: {
      type: 'number',
    },
    company: {
      type: 'string',
      required: true,
      unique: true,
    },
    jigsaw: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    doNotCall: {
      type: 'boolean',
      default: false,
    },
    email: {
      type: 'string',
      required: true,
      unique: true,
    },
    fax: {
      type: 'enum',
      enumType: 'string',
      enum: ['type1', 'type1'],
    },
    genderIdentity: {
      type: 'enum',
      enumType: 'string',
      enum: ['MALE', 'FEMALE', 'OTHER'],
    },
    lastModifiedBy: {
      //change it to userId
      type: 'string',
    },
    lastTransferDate: {
      type: 'string',
    },
    leadSource: {
      type: 'enum',
      enumType: 'string',
      enum: [
        'WEB',
        'PHONE_INQUIRY',
        'PARTNER_REFERRAL',
        'PURCHASED_LIST',
        'OTHER',
      ],
    },
    lastOwner: {
      //change it to userId
      type: 'string',
    },
    leadStatus: {
      type: 'enum',
      enumType: 'string',
      enum: ['OPEN', 'WORKING', 'CLOSES', 'CONVERTED'],
    },
    mobile: {
      type: 'string',
    },
    salutation: {
      type: 'enum',
      enumType: 'string',
      enum: ['MR', 'MS', 'MRS', 'DR', 'PROF', 'MX'],
    },
    firstName: {
      type: 'string',
    },
    middleName: {
      type: 'string',
    },
    lastName: {
      type: 'string',
    },
    suffix: {
      type: 'string',
    },
    numberOfEmployees: {
      type: 'string',
    },
    phone: {
      type: 'string',
    },
    pronouns: {
      type: 'enum',
      enumType: 'string',
      enum: ['SIR', 'MAAM'],
    },
    rating: {
      type: 'enum',
      enumType: 'string',
      enum: ['HOT', 'WARM', 'COLD'],
    },
    title: {
      type: 'string',
    },
    website: {
      type: 'string',
    },
  });
};
