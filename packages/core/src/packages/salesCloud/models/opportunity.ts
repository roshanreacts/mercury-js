import { Mercury } from '../../../mercury';

let mercury = new Mercury();

export const OpportunitySchema: any = () => {
  mercury.createModel('Opportunity', {
    accountId: {
      //change it to ref account
      type: 'string',
      required: true,
    },
    amount: {
      type: 'number',
    },
    budgetConfirm: {
      type: 'enum',
      enumType: 'string',
      enum: ['budget1', 'budget2'],
    },
    closeDate: {
      type: 'string',
    },
    contractId: {
      //change it to ref contract
      type: 'string',
    },
    description: {
      type: 'string',
    },
    discoveryCompleted: {
      type: 'enum',
      enumType: 'string',
      enum: ['discovery1', 'discovery2'],
    },
    expectedRevenue: {
      type: 'string',
    },
    forecastCategoryName: {
      type: 'enum',
      enumType: 'string',
      enum: ['Category1', 'Category2'],
    },
    lastModifiedBy: {
      //change it to userId
      type: 'string',
    },
    leadSource: {
      type: 'enum',
      enumType: 'string',
      enum: ['source1', 'source2', 'source3'],
    },
    lossReason: {
      type: 'enum',
      enumType: 'string',
      enum: ['loss1', 'loss2'],
    },
    nextOption: {
      type: 'string',
    },
    opportunityName: {
      type: 'string',
    },
    opportunityOwnerId: {
      //change it to userId
      type: 'string',
    },
    opportunitySource: {
      type: 'number',
    },
    priceBook2Id: {
      //change it to priceId
      type: 'string',
    },
    campaignId: {
      //change it to userId
      type: 'string',
    },
    isPrivate: {
      type: 'boolean',
      default: false,
    },
    probability: {
      type: 'string',
    },
    totalOpportunityQuantity: {
      type: 'number',
    },
    stageName: {
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
    syncedQuoteId: {
      //change it to userId
      type: 'string',
    },
    type: {
      type: 'enum',
      enumType: 'string',
      enum: ['stage1', 'stage2', 'stage3'],
    },
  });
};
