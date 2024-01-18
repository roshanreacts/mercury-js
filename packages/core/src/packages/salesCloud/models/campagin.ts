import { Mercury } from '../../../mercury';

export const CampaignSchema: any = (mercury: Mercury) => {
  mercury.createModel('Campaign', {
    name: {
      type: 'string',
      required: true,
    },
    type: {
      type: 'enum',
      enumType: 'string',
      enum: [
        'ADVERTISING',
        'DIRECT_MAIL',
        'EMAIL',
        'TELEMARKETING',
        'BANNER_ADS',
        'SEMINAR',
        'PUBLIC_RELATIONS',
        'PARTNERS',
        'REFERRAL_PROGRAM',
        'OTHER',
      ],
    },
    status: {
      type: 'enum',
      enumType: 'string',
      enum: ['PLANNED', 'SENT', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'],
    },
    startDate: {
      type: 'string',
    },
    endDate: {
      type: 'string',
    },
    expectedRevenue: {
      type: 'string',
    },
    budgetCost: {
      type: 'string',
    },
    actualCost: {
      type: 'string',
    },
    noSendToCampaign: {
      type: 'string',
    },
    parentCampaignId: {
      type: 'relationship',
      ref: 'Campaign',
    },
    description: {
      type: 'string',
    },
  });
};
