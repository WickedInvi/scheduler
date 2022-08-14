import { format } from 'date-fns';
import { formatSecondsForDisplay } from '@components/breakComponent/helpers';

interface LogRowProps {
  id: number;
  timeOfBreak: Date;
  timeInSeconds: number;
}

const LogRow = ({ id, timeOfBreak, timeInSeconds }: LogRowProps) => {
  return (
    <tr>
      <td>{id + 1}</td>
      <td>{format(timeOfBreak, 'HH:mm')}</td>
      <td>{formatSecondsForDisplay(timeInSeconds)}</td>
    </tr>
  );
};

export default LogRow;
