import { createRouter } from './context';
import { z } from 'zod';
import { resolve } from 'path';
import breakTimeLog from 'pages/api/breaktimelog';

export const breakTimeLogRouter = createRouter()
  .query('getAll', {
    async resolve({ ctx }) {
      return await ctx.prisma.breakTimeLog.findMany();
    },
  })
  .mutation('createBreakTimeLog', {
    input: z.object({ timeInSeconds: z.number(), userId: z.string() }),
    async resolve(req) {
      return await prisma?.breakTimeLog.create({
        data: {
          date: new Date(),
          timeInSeconds: req.input.timeInSeconds,
          timeOfBreak: new Date(),
          userId: req.input.userId,
        },
      });
    },
  });
// .mutation('updateBreakTimeLog', {})
// .mutation('deleteBreakTimeLog', {});
