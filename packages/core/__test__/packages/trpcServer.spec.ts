import { get } from 'lodash';
import {
  createZodInputs,
  getAllProcedureInputs,
  getQueries,
  createQueryProcedures,
  trpc,
} from '../../src/packages/trpcServer';
import schema from './schema';
import { z } from 'zod';

// const zObj: any = {
//   String: z.string().optional(),
//   ID: z.string().optional(),
//   Int: z.number().optional(),
// };

describe('getAllProcedureInputs', () => {
  it('should return all procedure inputs', () => {
    const data = getAllProcedureInputs(schema);
    expect(data).toEqual({
      UserInput: [
        {
          argName: 'name',
          argType: 'String',
        },
        {
          argName: 'age',
          argType: 'Int',
        },
      ],
    });
  });

  it('should return all enum types', () => {
    const data = getQueries(schema);
    expect(data).toEqual({});
  });

  it('should create query procedures', () => {
    const inputSchemaMap = getAllProcedureInputs(schema);
    const zObj = createZodInputs(inputSchemaMap);

    const data = createQueryProcedures({ typeDefs: schema }, { t: trpc });
    const testUser = trpc.procedure
      .input(
        z.object({
          where: z.object({
            id: zObj['whereID'],
            name: zObj['whereString'],
          }),
        })
      )
      .query(async ({ input }) => {
        return 'good';
      });
    //   @ts-ignore
    // console.log(testUser._def.inputs[0].shape);
    // console.log(data.getUser._def.inputs[0].shape.where.shape);

    // create server
    const testServer = trpc.router({
      getUser: testUser,
    });
    const genServer = trpc.router({
      listUsers: data.listUsers,
    });
    const testServerCaller = testServer
      .createCaller({})
      .getUser({ where: { id: { is: '12' } } });
    const genServerCaller = genServer
      .createCaller({})
      //   @ts-ignore
      .listUsers({});
    expect(data).toEqual({});
  });
});
