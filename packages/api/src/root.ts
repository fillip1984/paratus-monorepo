import { collectionRouter } from "./router/collection";
import { commentRouter } from "./router/comment";
import { sectionRouter } from "./router/section";
import { taskRouter } from "./router/task";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  collection: collectionRouter,
	section: sectionRouter,
	task: taskRouter,
	comment: commentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
