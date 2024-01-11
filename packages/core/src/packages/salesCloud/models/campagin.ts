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
      enum: ['type1', 'type2'],
    },
    status: {
      type: 'enum',
      enumType: 'string',
      enum: ['MR', 'MS', 'MRS', 'DR', 'PROF', 'MX'],
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
