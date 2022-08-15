import { format } from 'date-fns';
import {
  BsFillArrowLeftCircleFill,
  BsFillArrowRightCircleFill,
} from 'react-icons/bs';

interface MonthButtonControlProps {
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}
const MonthButtonControl = ({
  onNextMonth,
  onPrevMonth,
  currentMonth,
}: MonthButtonControlProps) => {
  return (
    <div className="flex items-center justify-center gap-5">
      <BsFillArrowLeftCircleFill
        className="fill-blue-500 hover:fill-blue-600"
        size={25}
        onClick={onPrevMonth}
      />
      <p>{format(currentMonth, 'MMM yy')}</p>
      <BsFillArrowRightCircleFill
        className="fill-blue-500 hover:fill-blue-600"
        size={25}
        onClick={onNextMonth}
      />
    </div>
  );
};

export default MonthButtonControl;
