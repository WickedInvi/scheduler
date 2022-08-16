import { toggleClasses, classNames } from '@components/breakComponent/helpers';
import { schedule } from '@components/breakComponent/workTimes';
import { useRef } from 'react';

import { format, isToday, isSameMonth, getDay, isSameDay } from 'date-fns';
import DateLabel from './DateLabel';

interface DayProps {
  day: Date;
  id: number;
  startOfMonth: Date;
  className?: string;
}

const colStartClasses = [
  '',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7',
];

const Day = ({ day, id, startOfMonth, className }: DayProps) => {
  const hiddenAddLabel = useRef<any>([]);
  const hiddenMenu = useRef<any>([]);

  return (
    <div
      className={classNames(
        `relative min-w-min w-32 h-32 hover:bg-slate-800 p-1 flex flex-col items-center border-2 border-slate-400`,
        id === 0 && colStartClasses[getDay(day) - 1],
        className
      )}
      onClick={() => {
        schedule.isApproved && schedule.month == format(startOfMonth, 'MMM')
          ? null
          : isSameMonth(day, startOfMonth)
          ? toggleClasses(hiddenMenu, id, ['hidden', 'flex'])
          : null;
      }}
      onMouseEnter={() => {
        isSameMonth(day, startOfMonth)
          ? hiddenAddLabel.current[id].classList.toggle('hidden')
          : null;
      }}
      onMouseLeave={() => {
        isSameMonth(day, startOfMonth)
          ? hiddenAddLabel.current[id].classList.toggle('hidden')
          : null;
      }}
    >
      <DateLabel day={day} startOfMonth={startOfMonth} />
      {schedule.workTimes
        .filter((workTime) => {
          return isSameDay(workTime.date, day) && !workTime.dayOff;
        })
        .map((day, id) => {
          return (
            <p key={id} className="text-sm">
              {day.start} - {day.end}
            </p>
          );
        })}
      {isSameMonth(day, startOfMonth) && (
        <label
          className="hidden"
          ref={(el) => (hiddenAddLabel.current[id] = el)}
        >
          Add
        </label>
      )}

      {isSameMonth(day, startOfMonth) && (
        <div
          ref={(el) => (hiddenMenu.current[id] = el)}
          className="hidden absolute top-20 bg-slate-400 gap-2 z-10"
        >
          <button
            onClick={() => {
              console.log('add');
            }}
          >
            Add time
          </button>
          <button>copy next week</button>
          <button>copy end week</button>
        </div>
      )}
    </div>
  );
};

export default Day;
