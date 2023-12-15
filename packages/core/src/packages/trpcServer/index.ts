import mercury, { Mercury, DB, ModelType } from '../../mercury';
import { initTRPC, ProcedureRouterRecord } from '@trpc/server';
import { z } from 'zod';
import path from 'path';
import fs from 'fs';
import _ from 'lodash';

const trpc = initTRPC.create();
const zObj: any = {
  String: z.string(),
  ID: z.string(),
  Int: z.number(),
};

type MercuryServerOptions = {
  t: typeof trpc;
};

type inputObj  = {
  argName: string,
  argType: string | Array<string>,
}

type inputSchemaObj = {
  [key: string]: Array<inputObj>
}
declare module '../../mercury' {
  interface Mercury {
    trpc: {
      appRouter: ReturnType<typeof createTrpcServer>;
      t: typeof trpc;
    };
  }
}

export default (config?: MercuryServerOptions) => {
  return (mercury: Mercury) => {
    if (!config) {
      config = {
        t: trpc,
      };
    }

    const router = config.t.router({
      greeting: config.t.procedure
        // This is the input schema of your procedure
        // 💡 Tip: Try changing this and see type errors on the client straight away
        .input(
          z.object({
            name: z.string().nullish(),
          })
        )
        .query(({ input }) => {
          // This is what you're returning to your client
          return {
            text: `hello ${input?.name ?? 'world'}`,
            // 💡 Tip: Try adding a new property here and see it propagate to the client straight-away
          };
        }),
    });

    mercury.trpc = {
      t: config.t,
      appRouter: createTrpcServer(mercury, config),
    };
  };
};

const zFieldMapping: { [type: string]: any } = {
  string: z.string(),
  id: z.string(),
  int: z.number(),
  number: z.number(),
  float: z.number(),
  boolean: z.boolean(),
  date: z.date(),
  relationship: z.string(),
  virtual: z.string(),
  mixed:z.string(),
  objectId:z.string(),
  decimal:z.number(),
  undefined: z.any()
}

const getZField = (value: TField) => {
  // @ts-ignore
  if(value.type == 'enum') return zFieldMapping[value?.enumType];
  let zfield = zFieldMapping[value.type];
  if(value?.many) zfield = zfield.array();
  if(!value?.required) zfield = zfield.optional();
  return zfield;
}

const getZObj = (mercury: Mercury, model: keyof DB) => {
  console.log("My resolvers are", mercury.resolvers, mercury.typeDefs);
  const obj: any = {};
  const modelFields = mercury.list.find((v) => v.name === model)?.fields;
  if (modelFields) {
    Object.entries(modelFields).forEach(([key, value]) => {
      obj[key] = getZField(value);
    });
  }
  return obj;
}

export const createInterfaces = (mercury: Mercury) => {
  const rootDirectory = process.cwd();
  const fileName = 'interfaces.ts';
  const filePath = path.join(rootDirectory, fileName);

  const recordType = mercury.list.map((model) => {
    return `${
      model.name
    }: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
      ctx: object;
      meta: object;
      errorShape: import("@trpc/server").DefaultErrorShape;
      transformer: import("@trpc/server").DefaultDataTransformer;
  }>, {
      get: import("@trpc/server").BuildProcedure<"query", {
          _config: import("@trpc/server").RootConfig<{
              ctx: object;
              meta: object;
              errorShape: import("@trpc/server").DefaultErrorShape;
              transformer: import("@trpc/server").DefaultDataTransformer;
          }>;
          _meta: object;
          _ctx_out: object;
          _input_in: {
            ${Object.keys(model.fields)
              .map((key) => {
                return `${key}?: string`;
              })
              .join(';\n')}
          };
          _input_out: {
            ${Object.keys(model.fields)
              .map((key) => {
                return `${key}?: string`;
              })
              .join(';\n')}
          };
          _output_in: typeof import("@trpc/server").unsetMarker;
          _output_out: typeof import("@trpc/server").unsetMarker;
      }, any>
    `;
  });
  const fileContent = `declare function createTrpcServer(): import("@trpc/server").CreateRouterInner<
  import("@trpc/server").RootConfig<{
    ctx: object;
    meta: object;
    errorShape: import("@trpc/server").DefaultErrorShape;
    transformer: import("@trpc/server").DefaultDataTransformer;
  }>,
  {
    ${recordType.join(';\n')}
  }
>;

export type AppRouter = ReturnType<typeof createTrpcServer>;
`;
  fs.writeFileSync(filePath, fileContent, 'utf-8');
};

// type DB = 'User' | 'Account';

function createTrpcServer(mercury: Mercury, options: MercuryServerOptions) {
  const { t } = options;
  const procedure = t.procedure;
  const genProcedure = (model: keyof DB, action: string) => {
    const obj: any = getZObj(mercury, model);
    return procedure
      .input(z.object(obj))
      .query(
        async ({ input }) =>{
          if(action === 'get'){
            return await mercury.db[model].get(input, { id: '1', profile: 'User' })
          } else if(action === 'list') {
            return await mercury.db[model].list(input, { id: '1', profile: 'User' })
          } else if(action === 'paginate') {
            return await mercury.db[model].paginate(input.query, input.filters, { id: '1', profile: 'User' })
          } else if(action === 'count') {
            return await mercury.db[model].count( { id: '1', profile: 'User' })
          } 
        }
      );
  };

  const genMutationProcedure = (model: keyof DB, action: string) => {
    const obj: any = getZObj(mercury, model);
    return procedure
      .input(z.object(obj))
      .mutation(
        async ({ input }) =>{
           if(action === 'create') {
            return await mercury.db[model].create(input, { id: '1', profile: 'User' })
          } else if(action === 'update') {
            return await mercury.db[model].update(input.id, input, { id: '1', profile: 'User' })
          } else if(action === 'delete') {
            return await mercury.db[model].delete(input.id, { id: '1', profile: 'User' })
          }
        }
      );
  }
  const data: any = {};
  (Object.keys(mercury.db) as (keyof DB)[]).forEach((model: keyof DB) => {
    data[model] = t.router({
      query: createQueryProcedures(mercury, options)
    });
  });
  createInterfaces(mercury); // This will generate the type defs file
  return t.router(data);
  // return t.router({
  //   User: t.router({
  //     get: procedure
  //       .input(z.object({ id: z.string() }))
  //       .query(async ({ input }) => {
  //         return await mercury.db.User.get(input, {
  //           id: '1',
  //           profile: 'public',
  //         });
  //       }),
  //   }),
  // });
}

const createQueryProcedures: any = ( mercury: Mercury, options: MercuryServerOptions) => {
  const { t } = options;
  const procedure = t.procedure;
  const allQueries: any = [];
  const queryProcedures: any = {};
  allQueries.map((query: any) => {
    const procedureReturnType = query.returnType;
    queryProcedures[query.name] = procedure.input(getProcedureInput(query.inputArgName)).query(({ input }) => {
      return "Working";
    })
  })
  return queryProcedures;
}

const getProcedureInput = (inputs: Array<inputObj>) => {
  const obj: any = {};
  inputs.map((input: any) => {
    obj[input.argName] = zObj[input.argType];
  })
  return z.object(obj);
}

// after getting the schema we need to execute this function , is it ok to store all input schema inside a variabel or do we need to create one file?
const createZodInputs = ( inputObj: inputSchemaObj ) => {
  Object.entries(inputObj).forEach(([key, value]) => {
    let obj: any = {};
    value.map((v:any) => {
      if(v.argName === "enum"){
        obj[key] = z.enum(v.argType);
      } else {
        obj[v.argName] = zFieldMapping[v.argType.toLowerCase()];
      }
    })
    zObj[key] = z.object(obj);
  });
}  

// For all procedure inputs, after this create zod inputs
function getAllProcedureInputs(data: any) {
  const inputTypes = _.map(data.definitions, (item) => {
    if (item?.kind === "InputObjectTypeDefinition") {
      return item;
    }
  }).filter(item => item);
  const finalTypes: any = {};
  const enumTypes: any = [];
  inputTypes.map(inputType => {
    const inputTypeValue = inputType?.fields.map((arg: any) => {
      let argType: any = arg?.type;
      argType = argType?.name?.value ?? argType?.type?.name?.value ?? argType?.type?.type?.name?.value;
      return {
        argName: arg?.name?.value,
        argType: argType
      };
    });
    return finalTypes[inputType?.name?.value] = inputTypeValue
  })
  return { ...finalTypes, ...(getEnumTypesData(data)) };
}

function getEnumTypesData(data: any) {
  const result: any = {};
  const enumTypes = _.map(data.definitions, (item) => {
    if (item?.kind === "EnumTypeDefinition") {
      return item;
    }
  }).filter(item => item);
  enumTypes.map(enumType => {
    result[enumType.name.value] = { argName: enumType.name.value, argType: enumType.values.map((value: any) => value?.name?.value) }
  }
  )
  return result;
}

// For query inputs

function getMutations(data: any) {
  const query = _.filter(data.definitions, (item) => {
    if (item?.name && item?.name?.value === "Query") {
      return item;
    }
  });

  return query[0].fields.map((it: any) => {
    return {
      name: it?.name?.value,
      inputArgName: it?.arguments.map((arg: any) => ({
        argName: arg?.name?.value,
        argType: arg?.type?.name?.value ? arg?.type?.name?.value : arg?.type?.type?.name?.value,
      })),
      returnType: it?.type?.name?.value,
    };
  });
}

// For mutation inputs

function getQueries(data: any) {
  const query = _.filter(data.definitions, (item) => {
    if (item.name && item.name.value === "Mutation") {
      return item;
    }
  });

  return query[0].fields.map((it: any) => {
    return {
      name: it?.name?.value,
      inputArgName: it.arguments.map((arg: any) => {
        let argType = arg?.type?.type;
        argType = argType?.name?.value ?? argType?.type?.name?.value ?? argType?.type?.type?.name?.value
        return {
          argName: arg?.name?.value,
          argType: argType
        }
      }),
      returnTypeInput: it?.type?.name?.value ? it?.type?.name?.value : it?.type?.type?.name?.value,
      returnTypeKind: it?.type?.kind
    };
  });
}




/// zod inputs created after fetching data from typedefs and formatting it