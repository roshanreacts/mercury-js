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
  const genProcedure = (model: keyof DB) => {
    const obj: any = {};
    const modelFields = mercury.list.find((v) => v.name === model)?.fields;
    if (modelFields) {
      Object.entries(modelFields).forEach(([key, value]) => {
        obj[key] = value.type == 'string' ? z.string().optional() : z.any();
      });
    }
    return procedure
      .input(z.object(obj))
      .query(
        async ({ input }) =>
          await mercury.db[model].get(input, { id: '1', profile: 'User' })
      );
  };
  const data: any = {};
  (Object.keys(mercury.db) as (keyof DB)[]).forEach((model: keyof DB) => {
    data[model] = t.router({
      get: genProcedure(model),
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
