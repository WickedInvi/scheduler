import { startOfToday, add } from 'date-fns';
import { useState } from 'react';

import Calendar from './Calendar';
import DaysOfTheWeek from './DaysOfTheWeek';
import MonthButtonControl from './MonthButtonControl';
import ToggleDays from './ToggleDays';

const CalendarComponent = () => {
  const [currentMonth, setCurrentMonth] = useState<Date>(startOfToday());
  const [showOtherDays, setShowOtherDays] = useState<boolean>(false);

  const toggleOtherDays = () => {
    setShowOtherDays(!showOtherDays);
  };

  const prevMonth = () => {
    let prevMonth = add(currentMonth, { months: -1 });
    setCurrentMonth(prevMonth);
  };

  const nextMonth = () => {
    let nextMonth = add(currentMonth, { months: +1 });
    setCurrentMonth(nextMonth);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-5 pb-10">
      <div>
        <div className="flex justify-between items-center">
          <h3> Display days of the month</h3>

          <ToggleDays
            showOtherDays={showOtherDays}
            onToggle={toggleOtherDays}
          />
          <MonthButtonControl
            onNextMonth={nextMonth}
            onPrevMonth={prevMonth}
            currentMonth={currentMonth}
          />
        </div>
        <DaysOfTheWeek />
        <Calendar currentMonth={currentMonth} showOtherDays={showOtherDays} />
      </div>
    </div>
  );
};

export default CalendarComponent;
