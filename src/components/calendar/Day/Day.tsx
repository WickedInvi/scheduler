import { toggleClasses, classNames } from '@components/breakComponent/helpers';
import { schedule } from '@components/breakComponent/workTimes';
import { useRef } from 'react';

import { format, isToday, isSameMonth, getDay, isSameDay } from 'date-fns';

interface DayProps {
  day: Date;
  id: number;
  startOfMonth: Date;
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

const Day = ({ day, id, startOfMonth }: DayProps) => {
  const hiddenAddLabel = useRef<any>([]);
  const hiddenMenu = useRef<any>([]);
  return (
    <div
      className={classNames(
        `relative min-w-min w-28 h-28 radius hover:bg-slate-800 p-2`,
        id === 0 && colStartClasses[getDay(day) - 1]
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
      <div className={classNames('flex flex-col justify-between items-center')}>
        <time
          dateTime={format(day, 'yyyy-MM-dd')}
          className={classNames(
            'bg-blue-500 text-white text-center text-xs font-bold p-1 rounded-full',
            isToday(day) && 'text-red-500 !text-bold !text-sm',
            isSameMonth(day, startOfMonth) && !isToday(day) && 'text-white',
            !isSameMonth(day, startOfMonth) && 'opacity-50'
          )}
        >
          {format(day, 'dd')}
        </time>
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
    </div>
  );
};

export default Day;
