import { createRouter } from './context';
import { z } from 'zod';
import { prisma } from '../db/client';

export const breakTimeLogRouter = createRouter()
  .query('getAll', {
    async resolve({ ctx }) {
      return await ctx.prisma.breakTimeLog.findMany();
    },
  })
  .mutation('create', {
    input: z.object({
      timeInSeconds: z.number(),
      userId: z.string(),
    }),
    async resolve({ input }) {
      return await prisma.breakTimeLog.create({
        data: {
          date: new Date(),
          timeInSeconds: input.timeInSeconds,
          timeOfBreak: new Date(),
          userId: input.userId,
        },
      });
    },
  });
// .mutation('update', {})
// .mutation('delete', {});
