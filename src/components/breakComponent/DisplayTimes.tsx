import { useEffect, useState } from 'react';
import { formatSecondsForDisplay } from './helpers';

import type { BreakTimeLog } from './types';

export interface ChildProps {}

export default function DisplayTimes(props: ChildProps) {
  const [breakTimeLog, setBreakTimeLog] = useState<BreakTimeLog[]>([]);

  useEffect(() => {
    if (localStorage.getItem('breakTimeLog') !== null) {
      console.log('called SetBreakTimeLog');
      setBreakTimeLog(JSON.parse(localStorage.getItem('breakTimeLog')!));
    }
  }, [localStorage.getItem('breakTimeLog')]);

  if (!breakTimeLog) {
    return <div>Loading ...</div>;
  }
  return (
    <>
      <div className="my-5">
        <h3>Total Break Time</h3>
        {breakTimeLog.length > 0 && (
          <p>
            {formatSecondsForDisplay(
              breakTimeLog.reduce((acc, curr) => acc + curr.timeInSeconds, 0)
            )}
          </p>
        )}
      </div>
      <div>
        <h3>Break taken</h3>
        {breakTimeLog.map((item, id) => (
          <p key={id}>{`Break taken at ${
            item.timeOfBreak
          } --- Break Time ${formatSecondsForDisplay(item.timeInSeconds)}`}</p>
        ))}
      </div>
    </>
  );
}
