import { format } from 'date-fns';
import { AnyNsRecord } from 'dns';
import { useEffect, useMemo, useState } from 'react';
import { useTable } from 'react-table';
import { formatSecondsForDisplay } from '../helpers';
import type { BreakTimeLog } from '../types';
import LogRow from './LogRow';
import TotalBreakTime from './TotalBreakTime';

export interface ChildProps {
  breakTimeLog: BreakTimeLog[];
}

type LogRow = {
  id: number;
  timeOfBreak: Date;
  timeInSeconds: number;
};

export default function DisplayTimes({ breakTimeLog }: ChildProps) {
  // TODO Figure out the type of LogRow
  const rows: any = [];

  breakTimeLog.forEach((item, id) => {
    return rows.push(
      <LogRow
        key={id}
        id={id}
        timeOfBreak={item.timeOfBreak}
        timeInSeconds={item.timeInSeconds}
      />
    );
  });

  if (!breakTimeLog) {
    return <div>Loading ...</div>;
  }

  return (
    <>
      <div>
        <TotalBreakTime breakTimeLog={breakTimeLog} />
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead>
              <tr>
                <th></th>
                <th>Break at</th>
                <th>Break Length</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </table>
        </div>
      </div>
    </>
  );
}
