import { useEffect, useState } from 'react';

interface ClockProps {
  classNames?: string;
}

const Clock = ({ classNames }: ClockProps) => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  const { hours, minutes, seconds } = {
    hours: currentTime.getHours(),
    minutes: currentTime.getMinutes(),
    seconds: currentTime.getSeconds(),
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`${classNames}`}>
      <span className="countdown font-mono text-5xl">
        <span style={{ '--value': hours }}></span>:
        <span style={{ '--value': minutes }}></span>:
        <span style={{ '--value': seconds }}></span>
      </span>
    </div>
  );
};

export default Clock;
