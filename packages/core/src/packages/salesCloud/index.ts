import { Mercury } from '../../mercury';

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
    mercury.createModel('Invoice', {
      name: {
        type: 'string',
        required: true,
      },
      total: {
        type: 'number',
        required: true,
      },
      customer: {
        type: 'string',
        required: true,
      },
      status: {
        type: 'enum',
        enumType: 'string',
        enum: ['active', 'inactive'],
        required: true,
      },
    });
  }
  console.log('salesModels');
  mercury.createModel('Customer', {
    name: {
      type: 'string',
      required: true,
    },
    total: {
      type: 'number',
      required: true,
    },
    customer: {
      type: 'string',
      required: true,
    },
    status: {
      type: 'enum',
      enumType: 'string',
      enum: ['active', 'inactive'],
      required: true,
    },
  });
};
