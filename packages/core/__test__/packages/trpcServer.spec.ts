import { get } from 'lodash';
import {
  createZodInputs,
  getAllProcedureInputs,
  getQueries,
  createQueryProcedures,
  trpc,
  getProcedureInput,
  createInterfaces,
} from '../../src/packages/trpcServer';
import schema from './schema';
import { z } from 'zod';
import mercury from '../../src/mercury';

// const zObj: any = {
//   String: z.string().optional(),
//   ID: z.string().optional(),
//   Int: z.number().optional(),
// };

describe('getAllProcedureInputs', () => {

  it('should return all procedure inputs', () => {
    const data = getAllProcedureInputs(schema);
    console.log("Input", data);
    expect(1).toEqual(1);
  });

  it('should return all Zod inputs', () => {
    const data = getAllProcedureInputs(schema);
    const zObj = createZodInputs(data);
    console.log("ZOBJ",zObj);
    // const input = getProcedureInput([{argName: "where", argType: 'whereAccountInput', isArgRequired: false}]);
    // console.log("Input", input.shape);
    expect(1).toEqual(1);
  });

  it('should return all Query Procedures types', () => {
    // const data = getQueries(schema);
    const data = createQueryProcedures({ typeDefs: schema }, { t: trpc });
    console.log("Data", data);
    expect(data).toEqual({});
  });

  it('should create query procedures', async () => {
    const inputSchemaMap = getAllProcedureInputs(schema);
    const zObj = createZodInputs(inputSchemaMap);
    const data = createQueryProcedures({ typeDefs: schema }, { t: trpc }, zObj);
    // const input = getProcedureInput([{argName: "where", argType: 'whereUserInput', isArgRequired: true}]);
    const input = {};
    // console.log("Input", input?.shape);
    const testUser = trpc.procedure
      .input(input)
      .query(async ({ input }) => {
        return ;
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
    const testServerCaller = await testServer
      .createCaller({})
      .getUser({ where : { name: { is: 'Praveen' }}});
    console.log("testServerCaller", testServerCaller);
    // const genServerCaller = genServer
    //   .createCaller({})
    //   //   @ts-ignore
    //   .listUsers({});
    expect(1).toEqual(1);
  });

  it("should create intefaces", async() => {
    // const testInterfaces = createInterfaces(mercury);
  });
});
