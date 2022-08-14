import { format } from 'date-fns';

interface ShiftTimeProps {
  label: string;
  date: Date | number;
}

const ShiftTime = ({ label, date }: ShiftTimeProps) => {
  return (
    <div className="flex flex-col items-center">
      <p>{label}</p>
      <p>{format(date, 'HH:mm')}</p>
    </div>
  );
};

export default ShiftTime;
