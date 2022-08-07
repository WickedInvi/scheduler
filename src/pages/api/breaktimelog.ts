// src/pages/api/breakTimeLog.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../server/db/client';

const breakTimeLog = async (req: NextApiRequest, res: NextApiResponse) => {
  const breakTimeLog = await prisma.breakTimeLog.findMany();
  res.status(200).json(breakTimeLog);
};

export default breakTimeLog;
