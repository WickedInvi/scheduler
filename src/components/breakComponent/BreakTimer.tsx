import { formatSecondsForDisplay } from './helpers';

interface BreakTimerProps {
  label: string;
  timer: number;
}

const BreakTimer = ({ timer, label }: BreakTimerProps) => {
  return (
    <p className="">
      {label} --- {formatSecondsForDisplay(timer)}
    </p>
  );
};

export default BreakTimer;
