import { Mercury } from '../../mercury';
import {
  CustomerSchema,
  Invoice,
  LeadSchema,
  AccountSchema,
  ContactSchema,
  OpportunitySchema,
  OpportunityProductSchema,
  ProductSchema,
  PriceBookSchema,
  QuoteSchema,
  CampaignSchema,
  FileSchema,
  PriceBookEntrySchema,
} from './models';
export interface MercurySalesPkgConfig {
  invoice: boolean;
}
export default (config?: MercurySalesPkgConfig) => {
  return (mercury: Mercury) => {
    if (!config) {
      config = {
        invoice: false,
      };
    }
    salesModels(config, mercury);
  };
};

const salesModels = (config: MercurySalesPkgConfig, mercury: Mercury) => {
  mercury.addGraphqlSchema(
    `
        type Query {
            hellov2: String
        }
    `,
    {
      Query: {
        hellov2: () => 'Hello World! V2 Here',
      },
    }
  );
  console.log('salesModels');
  if (config.invoice) {
    Invoice(mercury);
  }
  CustomerSchema(mercury);
  LeadSchema(mercury);
  AccountSchema(mercury);
  ContactSchema(mercury);
  OpportunitySchema(mercury);
  OpportunityProductSchema(mercury);
  ProductSchema(mercury);
  PriceBookSchema(mercury);
  QuoteSchema(mercury);
  CampaignSchema(mercury);
  FileSchema(mercury);
  PriceBookEntrySchema(mercury);
};
