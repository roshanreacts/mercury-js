import mercury, { Mercury, DB, ModelType } from '../../mercury';
import { initTRPC, ProcedureRouterRecord } from '@trpc/server';
import { z } from 'zod';
import path from 'path';
import fs from 'fs';
import _ from 'lodash';

export const trpc = initTRPC.create();
const zObj: any = {
  String: z.string().optional(),
  ID: z.string().optional(),
  Int: z.number().optional(),
};

type MercuryServerOptions = {
  t: typeof trpc;
};

type inputObj = {
  argName: string;
  argType: string | Array<string>;
};

type inputSchemaObj = {
  [key: string]: Array<inputObj>;
};
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

    mercury.trpc = {
      t: config.t,
      appRouter: createTrpcServer(mercury, config),
    };
  };
};

const zFieldMapping: { [type: string]: any } = {
  string: z.string().optional(),
  id: z.string().optional(),
  int: z.number().optional(),
  number: z.number().optional(),
  float: z.number().optional(),
  boolean: z.boolean().optional(),
  date: z.date().optional(),
  relationship: z.string().optional(),
  virtual: z.string().optional(),
  mixed: z.string().optional(),
  objectId: z.string().optional(),
  decimal: z.number().optional(),
  undefined: z.any().optional(),
};

const getZField = (value: TField) => {
  const type = value.type === 'enum' ? value.enumType : value.type;
  if (!type) {
    return z.any();
  }
  let zfield = zFieldMapping[type];
  if (value?.many) zfield = zfield.array();
  if (!value?.required) zfield = zfield.optional();
  return zfield;
};

const getZObj = (mercury: Mercury, model: keyof DB) => {
  console.log('My resolvers are', mercury.resolvers, mercury.typeDefs);
  const obj: any = {};
  const modelFields = mercury.list.find((v) => v.name === model)?.fields;
  if (modelFields) {
    Object.entries(modelFields).forEach(([key, value]) => {
      obj[key] = getZField(value);
    });
  }
  return obj;
};

export const createInterfaces = (mercury: Mercury) => {
  const rootDirectory = process.cwd();
  const fileName = 'interfaces.ts';
  const filePath = path.join(rootDirectory, fileName);
  const operType = (model: TModel) =>
    ['get', 'list', 'paginate', 'count'].map(
      (action) => `${action}: import("@trpc/server").BuildProcedure<"query", {
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
}, any>`
    );
  const recordType = mercury.list.map((model) => {
    return `${
      model.name
    }: import("@trpc/server").CreateRouterInner<import("@trpc/server").RootConfig<{
      ctx: object;
      meta: object;
      errorShape: import("@trpc/server").DefaultErrorShape;
      transformer: import("@trpc/server").DefaultDataTransformer;
  }>, {
      ${operType(model).join(';\n')}
  }>
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
    return procedure.input(z.object(obj));
  };
  // genetateType
  const inputSchemaMap = getAllProcedureInputs(mercury.typeDefs);
  console.log('inputSchemaMap', inputSchemaMap);
  createZodInputs(inputSchemaMap);
  console.log('zodObj', zObj);

  const queryProcedures: any = createQueryProcedures(mercury, options);
  const mutationProcedures: any = createMutationProcedures(mercury, options);
  // const tempRouter = {
  //   getUser: procedure
  //     .input(z.object({ name: z.string() }))
  //     .query(async ({ input }) => {
  //       return await mercury.db.User.get(input, {
  //         id: '1',
  //         profile: 'User',
  //       });
  //     }),
  // };
  // console.log('tempRouter', tempRouter);
  // console.log('queryProcedures', queryProcedures);
  // console.log('mutationProcedures', mutationProcedures);
  const data: any = t.router({
    query: t.router(queryProcedures),
    mutation: t.router(mutationProcedures),
  });
  createInterfaces(mercury); // This will generate the type defs file
  return data;
  // return t.router({
  //   query: t.router({
  //     getUser: procedure
  //       .input(z.object({ name: z.string() }))
  //       .query(async ({ input }) => {
  //         return await mercury.db.User.get(input, {
  //           id: '1',
  //           profile: 'User',
  //         });
  //       }),
  //   }),
  // });
}

export const createQueryProcedures: any = (
  mercury: Mercury,
  options: MercuryServerOptions
) => {
  const { t } = options;
  const procedure = t.procedure;
  const allQueries: any = getQueries(mercury.typeDefs);
  const queryProcedures: any = {};
  allQueries.map((query: any) => {
    const procedureReturnType = query.returnType;
    queryProcedures[query.name] = procedure
      .input(getProcedureInput(query.inputArgName))
      .query(({ input }) => {
        return 'Working';
      });
  });
  return queryProcedures;
};

const createMutationProcedures: any = (
  mercury: Mercury,
  options: MercuryServerOptions
) => {
  const { t } = options;
  const procedure = t.procedure;
  const allMutations: any = getMutations(mercury.typeDefs);
  const mutationProcedures: any = {};
  allMutations.map((query: any) => {
    const procedureReturnType = query.returnType;
    mutationProcedures[query.name] = procedure
      .input(getProcedureInput(query.inputArgName))
      .query(({ input }) => {
        return 'Working';
      });
  });
  return mutationProcedures;
};

const getProcedureInput = (inputs: Array<inputObj>) => {
  const obj: any = {};
  inputs.map((input: any) => {
    obj[input.argName] = zObj[input.argType];
  });
  return z.object(obj);
};

// after getting the schema we need to execute this function , is it ok to store all input schema inside a variabel or do we need to create one file?
export const createZodInputs = (inputObj: inputSchemaObj) => {
  Object.entries(inputObj).forEach(([key, value]) => {
    let obj: any = {};

    value.map((v: any) => {
      if (v.argName === 'enum') {
        obj[key] = z.enum(v.argType);
      } else {
        obj[v.argName] = zObj[v.argType];
      }
    });
    zObj[key] = z.object(obj).optional();
  });
  return zObj;
};

// For all procedure inputs, after this create zod inputs
export function getAllProcedureInputs(data: any) {
  const inputTypes = _.map(data.definitions, (item) => {
    if (item?.kind === 'InputObjectTypeDefinition') {
      return item;
    }
  }).filter((item) => item);
  const finalTypes: any = {};
  const enumTypes: any = [];
  inputTypes.map((inputType) => {
    const inputTypeValue = inputType?.fields.map((arg: any) => {
      let argType: any = arg?.type;
      argType =
        argType?.name?.value ??
        argType?.type?.name?.value ??
        argType?.type?.type?.name?.value;
      return {
        argName: arg?.name?.value,
        argType: argType,
      };
    });
    return (finalTypes[inputType?.name?.value] = inputTypeValue);
  });
  return { ...finalTypes, ...getEnumTypesData(data) };
}

function getEnumTypesData(data: any) {
  const result: any = {};
  const enumTypes = _.map(data.definitions, (item) => {
    if (item?.kind === 'EnumTypeDefinition') {
      return item;
    }
  }).filter((item) => item);
  enumTypes.map((enumType) => {
    result[enumType.name.value] = [
      {
        argName: 'enum',
        argType: enumType.values.map((value: any) => value?.name?.value),
      },
    ];
  });
  return result;
}

// For query inputs

export function getQueries(data: any) {
  const query = _.filter(data.definitions, (item) => {
    if (item?.name && item?.name?.value === 'Query') {
      return item;
    }
  });

  return query[0].fields.map((it: any) => {
    return {
      name: it?.name?.value,
      inputArgName: it?.arguments.map((arg: any) => ({
        argName: arg?.name?.value,
        argType: arg?.type?.name?.value
          ? arg?.type?.name?.value
          : arg?.type?.type?.name?.value,
      })),
      returnType: it?.type?.name?.value,
    };
  });
}

// For mutation inputs

function getMutations(data: any) {
  const query = _.filter(data.definitions, (item) => {
    if (item.name && item.name.value === 'Mutation') {
      return item;
    }
  });

  return query[0].fields.map((it: any) => {
    return {
      name: it?.name?.value,
      inputArgName: it.arguments.map((arg: any) => {
        let argType = arg?.type?.type;
        argType =
          argType?.name?.value ??
          argType?.type?.name?.value ??
          argType?.type?.type?.name?.value;
        return {
          argName: arg?.name?.value,
          argType: argType,
        };
      }),
      returnTypeInput: it?.type?.name?.value
        ? it?.type?.name?.value
        : it?.type?.type?.name?.value,
      returnTypeKind: it?.type?.kind,
    };
  });
}

/// zod inputs created after fetching data from typedefs and formatting it
