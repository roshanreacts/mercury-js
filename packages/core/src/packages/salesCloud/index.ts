import { Mercury } from '../../mercury';
import { InvoiceSchema, CustomerSchema } from './models/index';
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
  if (config.invoice) {
    InvoiceSchema();
  }
  CustomerSchema();
};
