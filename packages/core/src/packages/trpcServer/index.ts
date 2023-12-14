import { Mercury, DB, ModelType } from '../../mercury';
import { initTRPC, ProcedureRouterRecord } from '@trpc/server';
import { z } from 'zod';
import path from 'path';
import fs from 'fs';

const trpc = initTRPC.create();

type MercuryServerOptions = {
  t: typeof trpc;
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
      get: genProcedure(model, "get"),
      list: genProcedure(model, "list"),
      paginate: genProcedure(model, "paginate"),
      count: genProcedure(model, "count"),
      create: genMutationProcedure(model, "create"),
      update: genMutationProcedure(model, "update"),
      delete: genMutationProcedure(model, "delete")
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
