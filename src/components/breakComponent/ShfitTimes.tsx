import { format } from 'date-fns';

interface ShiftTimesProps {
  label: string;
  date: Date | number;
}

const ShiftTimes: React.FC<ShiftTimesProps> = ({
  label,
  date,
}: ShiftTimesProps) => {
  return (
    <div className="flex flex-col items-center">
      <p>Start Time</p>
      <p>{format(date, 'HH:mm')}</p>
    </div>
  );
};

export default ShiftTimes;
