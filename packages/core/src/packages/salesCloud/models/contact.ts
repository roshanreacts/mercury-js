import { Mercury } from '../../../mercury';

let mercury = new Mercury();

export const ContactSchema: any = () => {
  mercury.createModel('Contact', {
    accountId: {
      //change it to ref account
      type: 'string',
      required: true,
    },
    assistantName: {
      type: 'string',
    },
    assistantPhone: {
      type: 'string',
    },
    dob: {
      type: 'string',
    },
    ownerId: {
      //change it to user ref
      type: 'string',
      required: true,
    },
    jigsaw: {
      type: 'string',
    },
    department: {
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
    },
    fax: {
      type: 'string',
    },
    homePhone: {
      type: 'string',
    },
    lastModifiedBy: {
      //change it to userId
      type: 'string',
    },
    lastTransferDate: {
      type: 'string',
    },
    lastOwner: {
      //change it to userId
      type: 'string',
    },
    lastCURequestDate: {
      type: 'string',
    },
    lastCUUpdateDate: {
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
    mailingAddress: {
      type: 'string',
    },
    mobile: {
      type: 'string',
    },
    salutation: {
      type: 'enum',
      enumType: 'string',
      enum: ['MR', 'MRS'],
      required: true,
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
    otherAddress: {
      type: 'string',
    },
    otherPhone: {
      type: 'string',
    },
    phone: {
      type: 'string',
    },
    reportsToId: {
      //change to ref contact table
      type: 'string',
    },
    title: {
      type: 'string',
    },
    website: {
      type: 'string',
    },
  });
};
