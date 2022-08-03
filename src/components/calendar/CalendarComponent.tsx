import { toggleClasses, classNames } from '@components/stopWatch/helpers';
import { schedule } from '@components/stopWatch/workTimes';
import {
  startOfToday,
  format,
  startOfMonth,
  add,
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
import { BsFillArrowLeftCircleFill, BsFillArrowRightCircleFill } from 'react-icons/bs';

interface CalendarProps {}
const CalendarComponent: React.FC<CalendarProps> = ({}: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfToday());

  let today = startOfToday();
  let currentMonthStart = startOfMonth(currentMonth);

  let hiddenAddLabel = useRef<any>([]);
  let hiddenMenu = useRef<any>([]);

  const colStartClasses = ['', 'col-start-2', 'col-start-3', 'col-start-4', 'col-start-5', 'col-start-6', 'col-start-7'];

  const prevMonth = () => {
    let prevMonth = add(currentMonth, { months: -1 });
    setCurrentMonth(prevMonth);
  };

  const nextMonth = () => {
    let nextMonth = add(currentMonth, { months: +1 });
    setCurrentMonth(nextMonth);
  };
  // let hours = eachHourOfInterval({ start: startOfToday(), end: endOfToday() });
  // let minutes = eachMinuteOfInterval({ start: startOfToday(), end: endOfToday() });

  // useEffect(() => {
  //   minutes.forEach((minute) => {
  //     if (format(minute.getTime(), 'mm') === '15' || format(minute.getTime(), 'mm') === '30' || format(minute.getTime(), 'mm') === '45') {
  //       console.log(format(minute.getTime(), 'HH:mm'));
  //     }
  //   });
  // }, []);
  const [days, setDays] = useState<Date[]>([]);
  const [showOtherDays, setShowOtherDays] = useState<boolean>(false);

  useEffect(() => {
    showOtherDays
      ? setDays(
          eachDayOfInterval({
            start: startOfWeek(currentMonthStart, { weekStartsOn: 1 }),
            end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 }),
          })
        )
      : setDays(eachDayOfInterval({ start: currentMonthStart, end: endOfMonth(currentMonth) }));
  }, [showOtherDays, currentMonth]);

  // let days = eachDayOfInterval({
  //   start: startOfWeek(currentMonthStart, { weekStartsOn: 1 }),
  //   end: endOfWeek(endOfMonth(currentMonth), { weekStartsOn: 1 }),
  // });

  const toggleOtherDays = () => {
    setShowOtherDays(!showOtherDays);
  };

  return (
    <div className='w-full flex flex-col items-center justify-center gap-5'>
      <div>
        <div className='flex justify-between items-center'>
          <h3> Display days of the month</h3>
          <label htmlFor='checked-toggle' className='inline-flex relative items-center cursor-pointer'>
            <input type='checkbox' id='checked-toggle' className='sr-only peer' onChange={toggleOtherDays} />
            <div className="w-11 h-6 bg-gray-200 rounded-full dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 outline-none"></div>

            {showOtherDays ? (
              <span className='ml-3 text-sm font-medium text-gray-900 dark:text-gray-300'>Show Other Days</span>
            ) : (
              <span className='ml-3 text-sm font-medium text-gray-900 dark:text-gray-300'>Hide Other Days</span>
            )}
          </label>
          <div className='flex items-center justify-center gap-5'>
            <BsFillArrowLeftCircleFill className='fill-blue-500 hover:fill-blue-600' size={25} onClick={prevMonth} />
            <p>{format(currentMonth, 'MMM yy')}</p>
            <BsFillArrowRightCircleFill className='fill-blue-500 hover:fill-blue-600' size={25} onClick={nextMonth} />
          </div>
        </div>
        <div className='grid grid-cols-7 gap-2 max-w-[1280px] text-center'>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
          <div>Sun</div>
        </div>
        <div className='grid grid-cols-7 grid-rows-5 max-w-[1280px] border-[1px] border-red-500'>
          {days.map((day, id) => {
            return (
              // <div key={id} className='w-28 h-28 radius border-[1px] border-red-500'>
              <div
                key={day.toString()}
                className={classNames(
                  'relative min-w-min w-32 h-32 radius hover:bg-slate-800 p-2',
                  id === 0 && colStartClasses[getDay(day) - 1]
                )}
                onClick={() => {
                  schedule.isApproved && schedule.month == format(currentMonth, 'MMM')
                    ? null
                    : isSameMonth(day, currentMonthStart)
                    ? toggleClasses(hiddenMenu, id, ['hidden', 'flex'])
                    : null;
                }}
                onMouseEnter={() => {
                  isSameMonth(day, currentMonthStart) ? hiddenAddLabel.current[id].classList.toggle('hidden') : null;
                }}
                onMouseLeave={() => {
                  isSameMonth(day, currentMonthStart) ? hiddenAddLabel.current[id].classList.toggle('hidden') : null;
                }}
              >
                <div className={classNames('flex flex-col justify-between items-center')}>
                  <time
                    dateTime={format(day, 'yyyy-MM-dd')}
                    className={classNames(
                      'bg-blue-500 text-white text-center text-xs font-bold p-1 rounded-full',
                      isToday(day) && 'text-red-500',
                      isSameMonth(day, currentMonthStart) && !isToday(day) && 'text-white',
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
                        <p key={id} className='text-sm'>
                          {day.start} - {day.end}
                        </p>
                      );
                    })}
                  {/* <p className='text-sm'>12:00 - 13:00</p> */}
                  {isSameMonth(day, currentMonthStart) && (
                    <label className='hidden' ref={(el) => (hiddenAddLabel.current[id] = el)}>
                      Add
                    </label>
                  )}

                  {isSameMonth(day, currentMonthStart) && (
                    <div ref={(el) => (hiddenMenu.current[id] = el)} className='hidden absolute top-20 bg-slate-400 gap-2 z-10'>
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
                  {/* 
                  <div className='absolute top-20 bg-slate-400 flex gap-2 z-10'>
                    <button>Add time</button>
                    <button>copy next week</button>
                    <button>copy end week</button>
                  </div> */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarComponent;
