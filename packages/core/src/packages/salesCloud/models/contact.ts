import { Mercury } from '../../../mercury';

export const ContactSchema: any = (mercury: Mercury) => {
  mercury.createModel('Contact', {
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
    accountId: {
      type: 'relationship',
      ref: 'Account',
    },
    title: {
      type: 'string',
    },
    department: {
      type: 'string',
    },
    dob: {
      type: 'string',
    },
    reportsToId: {
      type: 'relationship',
      ref: 'Contact',
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
    lead: {
      type: 'relationship',
      ref: 'Lead',
    },
    phone: {
      type: 'string',
    },
    homePhone: {
      type: 'string',
    },
    mobile: {
      type: 'string',
    },
    otherPhone: {
      type: 'string',
    },
    fax: {
      type: 'string',
    },
    email: {
      type: 'string',
      required: true,
    },
    assistantName: {
      type: 'string',
    },
    assistantPhone: {
      type: 'string',
    },
    mailingAddress: {
      type: 'string',
    },
    mailingCity: {
      type: 'string',
    },
    mailingState: {
      type: 'string',
    },
    mailingCountry: {
      type: 'string',
    },
    mailingZipCode: {
      type: 'string',
    },
    OtherAddress: {
      type: 'string',
    },
    OtherCity: {
      type: 'string',
    },
    OtherState: {
      type: 'string',
    },
    OtherCountry: {
      type: 'string',
    },
    OtherZipCode: {
      type: 'string',
    },
    languages: {
      type: 'string',
    },
    level: {
      type: 'enum',
      enumType: 'string',
      enum: ['PRIMARY', 'SECONDARY', 'TERTIARY'],
    },
    description: {
      type: 'string',
    },
  });
};
