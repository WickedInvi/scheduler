import { useEffect, useState } from 'react';
import { formatSecondsForDisplay } from './helpers';

export interface ChildProps {}

export default function DisplayTimes(props: ChildProps) {
  const [breakTimeLog, setBreakTimeLog] = useState<
    { timeInSeconds: number; date: string }[]
  >(
    localStorage.getItem('breakTimeLog')
      ? JSON.parse(localStorage.getItem('breakTimeLog') || '[]')
      : []
  );

  useEffect(() => {
    console.log('breakTimeLog', [localStorage.getItem('breakTimeLog')]);
    setBreakTimeLog(JSON.parse(localStorage.getItem('breakTimeLog') || '[]'));
  }, [localStorage.getItem('breakTimeLog')]);

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
            item.date
          } --- Break Time ${formatSecondsForDisplay(item.timeInSeconds)}`}</p>
        ))}
      </div>
    </>
  );
}
