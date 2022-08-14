import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useTable } from 'react-table';
import { formatSecondsForDisplay } from './helpers';
import type { BreakTimeLog } from './types';

export interface ChildProps {
  breakTimeLog: BreakTimeLog[];
}

export default function DisplayTimes({ breakTimeLog }: ChildProps) {
  if (!breakTimeLog) {
    return <div>Loading ...</div>;
  }

  return (
    <>
      <div>
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead>
              <tr>
                <th></th>
                <th>Break at</th>
                <th>Break Length</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th></th>
                <td>Total Break Time</td>
                <td>
                  {formatSecondsForDisplay(
                    breakTimeLog.reduce(
                      (prev, curr) => prev + curr.timeInSeconds,
                      0
                    )
                  )}
                </td>
              </tr>
              {breakTimeLog.map((item, id) => {
                return (
                  <tr key={id}>
                    <th>{id + 1}</th>
                    <td>{format(item.timeOfBreak, 'HH:mm')}</td>
                    <td>{formatSecondsForDisplay(item.timeInSeconds)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
