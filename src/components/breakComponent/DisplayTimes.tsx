import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { useTable } from 'react-table';
import { formatSecondsForDisplay } from './helpers';
import type { BreakTimeLog } from './types';

export interface ChildProps {
  breakTimeLog: BreakTimeLog[];
}

export default function DisplayTimes(props: ChildProps) {
  const [breakTimeLog, setBreakTimeLog] = useState<BreakTimeLog[]>(
    props.breakTimeLog
  );
  const data = useMemo(() => breakTimeLog, [breakTimeLog]);
  const columns = useMemo(
    () => [
      { Header: 'Break taken at', accessor: 'date' },
      { Header: 'Break Time', accessor: 'timeInSeconds' },
    ],
    []
  );
  const tableInstance = useTable({ columns, data });
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;
  // useEffect(() => {
  //   if (localStorage.getItem('breakTimeLog') !== null) {
  //     console.log('called SetBreakTimeLog');
  //     setBreakTimeLog(JSON.parse(localStorage.getItem('breakTimeLog')!));
  //   }
  // }, [localStorage.getItem('breakTimeLog')]);

  useEffect(() => {
    console.log('props.BreakTimeLog changed');
    setBreakTimeLog(props.breakTimeLog);
  }, [props.breakTimeLog]);

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
                <th>Break taken at</th>
                <th>Break Time</th>
              </tr>
            </thead>
            <tbody>
              {breakTimeLog.map((item, id) => {
                return (
                  <tr key={id}>
                    <th>{id + 1}</th>
                    <td>{format(item.date, 'hh:mm')}</td>
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
