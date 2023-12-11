import { Mercury, DB } from '../../mercury';
import { initTRPC, ProcedureRouterRecord } from '@trpc/server';
import { z } from 'zod';

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

export default <Z extends string>(config?: MercuryServerOptions) => {
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
      appRouter: createTrpcServer<Z>(mercury, config),
    };
  };
};

function createTrpcServer<RModel extends string>(
  mercury: Mercury,
  options: MercuryServerOptions
) {
  const { t } = options;
  const procedure = t.procedure;
  const genProcedure = (model: RModel) =>
    procedure
      .input(
        z.object({
          name: z.string(),
        })
      )
      .query(
        ({ input }) => `Hello ${model.toString()}, you have sent ${input}!`
      );
  const data: Record<RModel, ReturnType<typeof genProcedure>> = {} as Record<
    RModel,
    ReturnType<typeof genProcedure>
  >;
  (Object.keys(mercury.db) as RModel[]).forEach((model: RModel) => {
    data[model] = genProcedure(model);
  });
  return t.router(data);
  //   const router = t.router(
  //     model.reduce(
  //       (a, v) => ({
  //         ...a,
  //         [v]: procedure
  //           .input(
  //             z.object({
  //               name: z.string(),
  //             })
  //           )
  //           .query(({ input }) => `Hello ${v}, you have sent ${input.name}!`),
  //       }),
  //       {}
  //     )
  //   );
  //   const router = t.router({
  //     greeting: procedure
  //       // This is the input schema of your procedure
  //       // 💡 Tip: Try changing this and see type errors on the client straight away
  //       .input(
  //         z.object({
  //           name: z.string().nullish(),
  //         })
  //       )
  //       .query(({ input }) => {
  //         // This is what you're returning to your client
  //         return {
  //           text: `hello ${input?.name ?? 'world'}`,
  //           // 💡 Tip: Try adding a new property here and see it propagate to the client straight-away
  //         };
  //       }),
  //     // 💡 Tip: Try adding a new procedure here and see if you can use it in the client!
  //     // getUser: publicProcedure.query(() => {
  //     //   return { id: '1', name: 'bob' };
  //     // }),
  //   });

  //   return router;
}
