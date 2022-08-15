import {
  startOfMonth,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  startOfWeek,
} from 'date-fns';
import { useEffect, useState } from 'react';
import Day from './Day/Day';

interface CalendarProps {
  currentMonth: Date;
  showOtherDays: boolean;
}

const Calendar = ({ currentMonth, showOtherDays }: CalendarProps) => {
  const [days, setDays] = useState<Date[]>([]);
  const currentMonthStart = startOfMonth(currentMonth);

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
          <Day day={day} key={id} id={id} startOfMonth={currentMonthStart} />
        );
      })}
    </div>
  );
};

export default Calendar;
