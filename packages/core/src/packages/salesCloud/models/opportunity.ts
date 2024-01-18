import { Mercury } from '../../../mercury';

export const OpportunitySchema: any = (mercury: Mercury) => {
  mercury.createModel('Opportunity', {
    owner: {
      type: 'relationship',
      ref: 'User',
    },
    isPrivate: {
      type: 'boolean',
      default: false,
    },
    accountId: {
      type: 'relationship',
      ref: 'Account',
    },
    priceBookId: {
      type: 'relationship',
      ref: 'PriceBook',
    },
    amount: {
      type: 'number',
    },
    closeDate: {
      type: 'string',
    },
    nextStep: {
      type: 'string',
    },
    stage: {
      type: 'enum',
      enumType: 'string',
      enum: [
        'PROSPECTING',
        'QUALIFICATION',
        'NEED_ANALYSIS',
        'VALUE_PROPOSITION',
        'DECISION_MAKER',
        'PRECEPTION_ANALYSIS',
        'PROPOSAL',
        'NEGOTIATION',
      ],
    },
    type: {
      type: 'enum',
      enumType: 'string',
      enum: ['UPGRADE', 'DOWNGRADE', 'REPLACEMENT'],
    },
    lead: {
      type: 'relationship',
      ref: 'Lead',
    },
    probability: {
      type: 'string',
    },
    campaignId: {
      type: 'relationship',
      ref: 'Campaign',
    },
    orderNo: {
      type: 'number',
    },
    competitor: {
      type: 'string',
    },
    generator: {
      type: 'string',
    },
    trackingNo: {
      type: 'number',
    },
    status: {
      type: 'enum',
      enumType: 'string',
      enum: ['IN_PROGRESS', 'COMPLETED', 'BEGIN'],
    },
    description: {
      type: 'string',
    },
  });
};
