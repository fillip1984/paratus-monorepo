import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  type trpcContextShape,
} from "../trpc";

export const collectionRouter = createTRPCRouter({
  readAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.collection.findMany({
      select: {
        id: true,
        name: true,
        position: true,
        parentId: true,
        children: {
          select: {
            id: true,
            name: true,
            parentId: true,
          },
        },
        sections: {
          select: {
            id: true,
            name: true,
            position: true,
            _count: {
              select: {
                tasks: { where: { complete: { not: true } } },
              },
            },
          },
        },
      },
      orderBy: {
        position: "asc",
      },
    });
    // another idea to sum: collection.sections.map((s) => s.tasks).flat(1).length}
    // return collections.map((collection) => {
    // 	return {
    // 		...collection,
    // 		taskCount: collection.sections
    // 			.map((s) => s.tasks.length)
    // 			.reduce((a, b) => a + b, 0),
    // 	};
    // });
  }),
  readOne: publicProcedure
    .input(z.object({ id: z.string().min(1) }))
    .query(async ({ ctx, input }) => {
      if (input.id === "inbox") {
        const inboxId = (await findOrCreateInbox(ctx)).id;
        return await fetchCollection(inboxId, ctx);
      } else if (input.id === "today") {
        return await fetchCollection(input.id, ctx);
      } else if (input.id === "upcoming") {
        return await fetchCollection(input.id, ctx);
      } else {
        return fetchCollection(input.id, ctx);
      }
    }),
  // inbox: publicProcedure.query(async ({ ctx }) => {
  //   const inboxId = (await findOrCreateInbox(ctx)).id;
  //   return await fetchCollection(inboxId, ctx);
  // }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const collectionCount = await ctx.db.collection.count();
      return await ctx.db.collection.create({
        data: {
          name: input.name,
          position: collectionCount + 1,
          sections: {
            create: [
              {
                name: "Uncategorized",
                position: 0,
              },
            ],
          },
        },
      });
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        parentId: z.string().nullish(),
        position: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.collection.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          parentId: input.parentId,
          position: input.position,
        },
      });
    }),
  delete: publicProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.collection.delete({
        where: {
          id: input.id,
        },
      });
    }),
  reorder: publicProcedure
    .input(
      z.array(
        z.object({
          id: z.string().min(1),
          position: z.number(),
        }),
      ),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(async (tx) => {
        for (const collection of input) {
          await tx.collection.update({
            where: {
              id: collection.id,
            },
            data: {
              position: collection.position,
            },
          });
        }
      });
    }),
  inboxId: publicProcedure.query(async ({ ctx }) => {
    const inbox = await findOrCreateInbox(ctx);
    return inbox.id;
  }),
});

async function fetchCollection(id: string, ctx: trpcContextShape) {
  return await ctx.db.collection.findFirst({
    where: { id: id },
    select: {
      id: true,
      name: true,
      position: true,
      sections: {
        orderBy: {
          position: "asc",
        },
        select: {
          id: true,
          name: true,
          position: true,
          collectionId: true,
          _count: {
            select: {
              tasks: { where: { complete: { not: true }, parentId: null } },
            },
          },
          tasks: {
            orderBy: {
              position: "asc",
            },
            include: {
              children: {
                select: {
                  complete: true,
                  id: true,
                  text: true,
                  dueDate: true,
                  priority: true,
                  sectionId: true,
                  position: true,
                  parentId: true,
                },
                orderBy: {
                  position: "asc",
                },
              },
            },
            where: { complete: false },
          },
        },
      },
    },
    orderBy: {
      name: "asc",
    },
  });
}

async function findOrCreateInbox(ctx: trpcContextShape) {
  const existingInbox = await ctx.db.collection.findFirst({
    where: { name: "Inbox" },
    select: { id: true },
  });
  if (existingInbox) {
    return existingInbox;
  } else {
    return await ctx.db.collection.create({
      data: {
        name: "Inbox",
        position: 0,
        sections: {
          create: [
            {
              name: "Uncategorized",
              position: 0,
            },
          ],
        },
      },
      select: {
        id: true,
      },
    });
  }
}
