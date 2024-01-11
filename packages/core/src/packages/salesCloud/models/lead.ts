import { Mercury } from '../../../mercury';

export const LeadSchema: any = (mercury: Mercury) => {
  mercury.createModel('Lead', {
    owner: {
      type: 'relationship',
      ref: 'User',
      required: true,
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
    company: {
      type: 'string',
      required: true,
    },
    title: {
      type: 'string',
    },
    phone: {
      type: 'string',
    },
    rating: {
      type: 'enum',
      enumType: 'string',
      enum: ['HOT', 'WARM', 'COLD'],
    },
    mobile: {
      type: 'string',
    },
    email: {
      type: 'string',
      required: true,
    },
    website: {
      type: 'string',
    },
    fax: {
      type: 'string',
    },
    source: {
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
    annualRevenue: {
      type: 'number',
    },
    leadStatus: {
      type: 'enum',
      enumType: 'string',
      enum: ['OPEN', 'WORKING', 'CLOSES', 'CONVERTED'],
    },
    numberOfEmployees: {
      type: 'string',
    },
    street: {
      type: 'string',
    },
    city: {
      type: 'string',
    },
    state: {
      type: 'string',
    },
    country: {
      type: 'string',
    },
    zipCode: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    productInterest: {
      type: 'string',
    },
    currentGenerator: {
      type: 'string',
    },
    noOfLocation: {
      type: 'string',
    },
    campaign: {
      type: 'relationship',
      ref: 'Campaign',
    },
  });
};
