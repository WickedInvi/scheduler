import { formatSecondsForDisplay } from '../helpers';
import { BreakTimeLog } from '../types';

export interface TotalBreakTimeProps {
  breakTimeLog: BreakTimeLog[];
}

const TotalBreakTime = ({ breakTimeLog }: TotalBreakTimeProps) => {
  return (
    <div className="flex flex-col items-center text-lg font-bold">
      <p>Total Break Time</p>
      <p>
        {formatSecondsForDisplay(
          breakTimeLog.reduce((prev, curr) => prev + curr.timeInSeconds, 0)
        )}
      </p>
    </div>
  );
};

export default TotalBreakTime;
