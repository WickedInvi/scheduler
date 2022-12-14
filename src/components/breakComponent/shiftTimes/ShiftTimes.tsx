import { parseDateFromString } from '@components/breakComponent/helpers';
import { isSameDay } from 'date-fns';
// Data
import { schedule } from '@components/breakComponent/workTimes';
// Components
import ShiftTime from './ShiftTime';

interface ShiftTimesProps {
  day: Date;
}

// TODAY WORK TIMES
type WorkTime = {
  date: Date;
  start: string;
  end: string;
  dayOff: boolean;
};

const ShiftTimes = ({ day }: ShiftTimesProps) => {
  const todayWorkTimes: WorkTime | undefined = schedule.workTimes.find(
    (workTime) => isSameDay(workTime.date, day)
  );

  const todayStartTime = parseDateFromString(day, todayWorkTimes?.start);
  const todayEndTime = parseDateFromString(day, todayWorkTimes?.end);

  return (
    <div className="mt-5">
      <p className="font-bold text-xl text-center">Shift Times</p>
      <div className="flex gap-10 mb-10 justify-center">
        <ShiftTime date={todayStartTime} label="Start Time" />
        <ShiftTime date={todayEndTime} label="Finish Time" />
      </div>
    </div>
  );
};

export default ShiftTimes;
