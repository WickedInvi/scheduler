import React, { useState, useRef, useEffect } from 'react';

export interface ChildProps {
  setTimer: (timer: number) => void;
}

export default function StopWatch(props: ChildProps) {
  const [timer, setTimer] = useState(0);
  const [lastBreakTimer, setLastBreakTimer] = useState(0);

  const [minWaitTime, setMinWaitTime] = useState(0);

  const [isActive, setIsActive] = useState(false);
  const [minBreakTime, setMinBreakTime] = useState(0);
  const timerRef = useRef<any>(null);
  const lastBreakTimerRef = useRef<any>(null);

  const stopButtonRef = useRef<HTMLButtonElement>(null);

  const d1 = new Date('1995-12-17T03:21:00');
  const d2 = new Date('1995-12-17T03:24:00');

  const diff = d2.getTime() - d1.getTime();

  // console.log(`Diff is ${diff / 1000 / 60} min`);

  useEffect(() => {
    lastBreakTimerRef.current = setInterval(() => {
      setLastBreakTimer((lastBreakTimer) => lastBreakTimer + 1);
    }, 1000);

    return () => clearInterval(lastBreakTimerRef.current);
  }, []);

  const handleStart = () => {
    if (lastBreakTimer < minWaitTime * 60) {
      alert('Cannot take a break! Wait 30 Minutes');
    } else {
      setIsActive(true);
      timerRef.current = setInterval(() => {
        setTimer((timer) => timer + 1);
      }, 1000);
      setLastBreakTimer(0);
      clearInterval(lastBreakTimerRef.current);
    }
  };

  const handleStop = () => {
    const minutes = Math.floor(timer / 60) % 60;

    if (minutes < minBreakTime) {
      alert(`You must take a break of at least ${minBreakTime} minutes.`);
    } else {
      clearInterval(timerRef.current);
      setIsActive(false);
      props.setTimer(timer);
      setTimer(0);
      lastBreakTimerRef.current = setInterval(() => {
        setLastBreakTimer((lastBreakTimer) => lastBreakTimer + 1);
      }, 1000);
    }
  };

  const formatTime = (time: number) => {
    const getSeconds = `0${time % 60}`.slice(-2);
    const getMinutes = `0${Math.floor(time / 60) % 60}`.slice(-2);
    const getHours = `0${Math.floor(time / 3600)}`.slice(-2);

    return `${getHours} : ${getMinutes} : ${getSeconds}`;
  };

  return (
    <div className="flex gap-10">
      <div className="flex flex-col items-center justify-start">
        <h3 className="font-bold text-3xl">Break Timer</h3>
        <p className="">Break timer --- {formatTime(timer)}</p>

        <p className="">
          Time since last break --- {formatTime(lastBreakTimer)}
        </p>
        <div className="flex flex-col items-center gap-5">
          <div>
            {!isActive ? (
              <button
                onClick={handleStart}
                className="rounded-full text-center py-2 px-10 bg-green-500"
              >
                Start
              </button>
            ) : (
              <button
                ref={stopButtonRef}
                onClick={handleStop}
                disabled={!isActive}
                className="rounded-full text-center py-2 px-10 bg-red-500"
              >
                Stop
              </button>
            )}
          </div>
        </div>
      </div>
      {/* <div className='flex flex-col items-center justify-start'>
        <h3 className='font-bold text-3xl'>Enter Manually</h3>
        <input
          type='number'
          className='rounded-full text-center py-2 px-10'
        />
      </div> */}
    </div>
  );
}
