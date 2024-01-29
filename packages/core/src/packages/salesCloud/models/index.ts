import { Mercury } from '../../../mercury';

import { CustomerSchema } from './customer';
import { InvoiceSchema } from './invoice';
import { LeadSchema } from './lead';
import { AccountSchema } from './account';
import { ContactSchema } from './contact';
import { OpportunitySchema } from './opportunity';
import { OpportunityProductSchema } from './opportunityProduct';
import { ProductSchema } from './product';
import { PriceBookSchema } from './priceBook';
import { QuoteSchema } from './quote';
import { CampaignSchema } from './campagin';
import { FileSchema } from './files';
import { PriceBookEntrySchema } from './priceBookEntry';

const Invoice: any = (mercury: Mercury) =>
  mercury.createModel('Invoice', InvoiceSchema, {
    recordOwner: true,
  });

export {
  Invoice,
  CustomerSchema,
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
};
