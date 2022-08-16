import { toggleClasses, classNames } from '@components/breakComponent/helpers';
import { format, isToday, isSameMonth, getDay, isSameDay } from 'date-fns';

interface DayProps {
  day: Date;
  startOfMonth: Date;
}
const DateLabel = ({ day, startOfMonth }: DayProps) => {
  return (
    <p
      className={classNames(
        'bg-blue-500 text-white text-center text-xs font-bold p-1 rounded-full',
        isToday(day) && 'text-black !text-bold !text-sm',
        isSameMonth(day, startOfMonth) && !isToday(day) && 'text-white',
        !isSameMonth(day, startOfMonth) && 'opacity-50'
      )}
    >
      {format(day, 'dd')}
    </p>
  );
};

export default DateLabel;
