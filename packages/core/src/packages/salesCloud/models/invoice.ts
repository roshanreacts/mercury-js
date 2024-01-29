import { Mercury } from '../../../mercury';

// export const InvoiceSchema: any = (mercury: Mercury) => {
//   mercury.createModel('Invoice', {
//     name: {
//       type: 'string',
//       required: true,
//     },
//     total: {
//       type: 'number',
//       required: true,
//     },
//     customer: {
//       type: 'string',
//       required: true,
//     },
//     status: {
//       type: 'enum',
//       enumType: 'string',
//       enum: ['active', 'inactive'],
//       required: true,
//     },
//   });
// };

export const InvoiceSchema: any = {
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
};
