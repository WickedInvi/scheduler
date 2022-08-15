import { toggleClasses, classNames } from '@components/breakComponent/helpers';
import { schedule } from '@components/breakComponent/workTimes';

import {
  format,
  startOfMonth,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  startOfWeek,
  isToday,
  isSameMonth,
  getDay,
  isSameDay,
} from 'date-fns';
import { useEffect, useRef, useState } from 'react';

interface CalendarProps {
  currentMonth: Date;
  showOtherDays: boolean;
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

const Calendar = ({ currentMonth, showOtherDays }: CalendarProps) => {
  const [days, setDays] = useState<Date[]>([]);
  const hiddenAddLabel = useRef<any>([]);
  const hiddenMenu = useRef<any>([]);
  let currentMonthStart = startOfMonth(currentMonth);

  useEffect(() => {
    showOtherDays
      ? setDays(
          eachDayOfInterval({
            start: startOfWeek(currentMonthStart, { weekStartsOn: 1 }),
            end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 }),
          })
        )
      : setDays(
          eachDayOfInterval({
            start: currentMonthStart,
            end: endOfMonth(currentMonth),
          })
        );
  }, [showOtherDays, currentMonth]);

  return (
    <div className="grid grid-cols-7 grid-rows-5 max-w-[1280px] border-[1px] border-red-500">
      {days.map((day, id) => {
        return (
          <div
            key={day.toString()}
            className={classNames(
              'relative min-w-min w-32 h-32 radius hover:bg-slate-800 p-2',
              id === 0 && colStartClasses[getDay(day) - 1]
            )}
            onClick={() => {
              schedule.isApproved &&
              schedule.month == format(currentMonth, 'MMM')
                ? null
                : isSameMonth(day, currentMonthStart)
                ? toggleClasses(hiddenMenu, id, ['hidden', 'flex'])
                : null;
            }}
            onMouseEnter={() => {
              isSameMonth(day, currentMonthStart)
                ? hiddenAddLabel.current[id].classList.toggle('hidden')
                : null;
            }}
            onMouseLeave={() => {
              isSameMonth(day, currentMonthStart)
                ? hiddenAddLabel.current[id].classList.toggle('hidden')
                : null;
            }}
          >
            <div
              className={classNames(
                'flex flex-col justify-between items-center'
              )}
            >
              <time
                dateTime={format(day, 'yyyy-MM-dd')}
                className={classNames(
                  'bg-blue-500 text-white text-center text-xs font-bold p-1 rounded-full',
                  isToday(day) && 'text-red-500',
                  isSameMonth(day, currentMonthStart) &&
                    !isToday(day) &&
                    'text-white',
                  !isSameMonth(day, currentMonthStart) && 'opacity-50'
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
              {isSameMonth(day, currentMonthStart) && (
                <label
                  className="hidden"
                  ref={(el) => (hiddenAddLabel.current[id] = el)}
                >
                  Add
                </label>
              )}

              {isSameMonth(day, currentMonthStart) && (
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
      })}
    </div>
  );
};

export default Calendar;
