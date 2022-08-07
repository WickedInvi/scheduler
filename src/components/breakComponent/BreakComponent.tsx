import {
  differenceInMinutes,
  differenceInSeconds,
  format,
  isSameDay,
  startOfToday,
} from 'date-fns';
import React, { useState, useRef, useEffect } from 'react';
import {
  formatSecondsForDisplay,
  dateFromLocalStorage,
  addTimeToDate,
  parseDateFromString,
  classNames,
} from './helpers';

import { schedule } from './workTimes';
import ShiftTimes from './ShiftTimes';

import type { BreakTimeLog } from './types';

export interface BreakComponentProps {
  cookies: Record<string, string>;
}

const BreakComponent: React.FC<BreakComponentProps> = (
  props: BreakComponentProps
) => {
  const [isActive, setIsActive] = useState<boolean>();

  // TODO Use DB for this
  const [breakTimeLog, setBreakTimeLog] = useState<BreakTimeLog[]>();

  // Settings
  const minBreakTime = 0;
  let today = startOfToday();

  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();

  // CURRENT TIME
  const [currentTime, setCurrentTime] = useState<Date>();

  // MAX BREAK TIME
  const [maxBreakTime, setMaxBreakTime] = useState<number>(0);

  const [canTakeBreak, setCanTakeBreak] = useState(false);

  // TIMER
  const [timer, setTimer] = useState<number>(0);
  const timerRef = useRef<any>(null);

  // LAST BREAK TIMER
  const [lastBreakTimer, setLastBreakTimer] = useState<number>(0);
  const lastBreakTimerRef = useRef<any>(null);

  // TODAY WORK TIMES
  type WorkTime = {
    date: Date;
    start: string;
    end: string;
    dayOff: boolean;
  };

  const todayWorkTimes: WorkTime | undefined = schedule.workTimes.find(
    (workTime) => isSameDay(workTime.date, today)
  );
  const todayStartTime = parseDateFromString(today, todayWorkTimes?.start);
  const todayEndTime = parseDateFromString(today, todayWorkTimes?.end);

  // REFERENCES
  const manualBreakRef = useRef<HTMLInputElement>(null);

  // TIMER FUNCTIONS
  const startLastBreakTimer = () => {
    lastBreakTimerRef.current = setInterval(() => {
      setLastBreakTimer((lastBreakTimer) => lastBreakTimer + 1);
    }, 1000);
  };

  const startBreakTimer = () => {
    timerRef.current = setInterval(() => {
      setTimer(
        differenceInSeconds(
          new Date(),
          dateFromLocalStorage('startOfBreakTime')
        )
      );
    }, 1000);
  };

  // ON LOAD
  useEffect(() => {
    setCurrentTime(new Date());
  }, []);

  useEffect(() => {
    setIsActive(localStorage.getItem('isActive') === 'true');
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTime]);

  useEffect(() => {
    if (localStorage.getItem('breakTimeLog') !== null) {
      console.log('breakTimeLog is not null');
      localStorage.setItem('breakTimeLog', JSON.stringify(breakTimeLog));
    }
  }, [breakTimeLog]);

  useEffect(() => {
    if (typeof window !== 'undefined' && currentTime) {
      isActive && localStorage.getItem('breakTimer')
        ? setTimer(
            differenceInSeconds(
              currentTime,
              dateFromLocalStorage('startOfBreakTime')
            )
          )
        : null;

      !isActive && localStorage.getItem('lastBreakTimer')
        ? setLastBreakTimer(
            differenceInSeconds(
              currentTime,
              dateFromLocalStorage('lastBreakTimer')
            )
          )
        : null;
    }
    let shiftLengthInMin = differenceInMinutes(todayEndTime, todayStartTime);
    let breakTime = schedule.breakTimeLengths.find(
      (breakTime) => shiftLengthInMin <= breakTime.shiftLength
    );

    // TODO handle undefined
    if (breakTime) {
      setMaxBreakTime(breakTime?.breakTime);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isActive) {
      setLastBreakTimer(0);
      startBreakTimer();
    }

    if (!isActive && localStorage.getItem('lastBreakTimer')) {
      setTimer(0);
      startLastBreakTimer();
    }

    return () => {
      clearInterval(timerRef.current);
      clearInterval(lastBreakTimerRef.current);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // LOCAL STORAGE HANDLERS
  const localStorageStartHandler = () => {
    localStorage.setItem('startOfBreakTime', new Date().getTime().toString());
    localStorage.setItem('isActive', 'true');
  };

  const localStorageStopHandler = () => {
    localStorage.setItem('isActive', 'false');
    localStorage.setItem('lastBreakTimer', new Date().getTime().toString());
  };

  // START HANDLER
  const handleStart = (e: React.MouseEvent<HTMLButtonElement>) => {
    localStorageStartHandler();
    setIsActive(true);
    setLastBreakTimer(0);
    clearInterval(lastBreakTimerRef.current);
    startBreakTimer();
    (e.target as HTMLButtonElement).textContent = 'Stop';
  };

  // STOP HANDLER
  const handleStop = (e: React.MouseEvent<HTMLButtonElement>) => {
    localStorageStopHandler();
    setIsActive(false);
    const minutes = Math.floor(timer / 60) % 60;
    if (minutes < minBreakTime) {
      alert(`You must take a break of at least ${minBreakTime} minutes.`);
    } else {
      setBreakTimeLog((prev) => {
        console.log(prev);
        if (prev !== undefined) {
          return [
            ...prev,
            {
              date: new Date(),
              timeInSeconds: timer,
              timeOfBreak: `${minutes} minutes`,
            },
          ];
        } else {
          return [
            {
              date: new Date(),
              timeInSeconds: timer,
              timeOfBreak: `${minutes} minutes`,
            },
          ];
        }
      });
      clearInterval(timerRef.current);
      setIsActive(false);
      setTimer(0);
      startLastBreakTimer();
      (e.target as HTMLButtonElement).textContent = 'Start';
    }
  };

  const handleStartStopClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    isActive ? handleStop(e) : handleStart(e);
  };

  // RESET HANDLER
  const handleReset = () => {
    localStorage.clear();
    clearInterval(timerRef.current);
    clearInterval(lastBreakTimerRef.current);

    setIsActive(false);
    setTimer(0);
    setLastBreakTimer(0);
  };

  const handleClick = () => {
    console.log(localStorage.getItem('breakTimeLog'));
  };

  const handleShiftTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempTime = addTimeToDate(today, e.target.value);

    addTimeToDate(today, e.target.value);

    if (e.target.id == 'shiftStartTime') setStartTime(tempTime);
    if (e.target.id == 'shiftEndTime') setEndTime(tempTime);
  };

  if (!currentTime) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex flex-col gap-10 border-2">
      <h1 className="select-none text-5xl">
        Time now is: {format(currentTime, 'HH:mm:ss')}
      </h1>
      <h2>Break Component</h2>
      <div>
        <div className="flex gap-10 mb-10 justify-center">
          <ShiftTimes date={todayStartTime} label="Start Time" />
          <ShiftTimes date={todayEndTime} label="End Time" />
        </div>
        <button className="bg-red-500" onClick={handleClick}>
          Click Me
        </button>
        <div className="flex flex-col items-center justify-start">
          <h3 className="font-bold text-3xl">Break Timer</h3>

          <div className="flex items-center gap-5">
            <label htmlFor="">Enter break time manually</label>
            <input
              type="number"
              ref={manualBreakRef}
              min="1"
              max="60"
              className="text-black text-center max-w-max rounded-full pl-2"
            />

            <input
              type="time"
              step="360"
              className="text-black text-center max-w-max rounded-full pl-2"
            />
            <button
              onClick={() => {
                if (manualBreakRef.current) {
                  console.log(manualBreakRef.current.value);
                }
              }}
              className="rounded-full text-center py-2 px-10 bg-blue-500"
            >
              Add break time
            </button>
          </div>

          <p className="">Break timer --- {formatSecondsForDisplay(timer)}</p>
          <p className="">
            Time since last break --- {formatSecondsForDisplay(lastBreakTimer)}
          </p>
          <div className="flex items-center gap-5">
            <button
              onClick={handleStartStopClick}
              disabled={canTakeBreak}
              className={classNames(
                'rounded-full text-center py-2 px-10 bg-green-500',
                isActive && 'bg-red-500',
                canTakeBreak && 'bg-gray-500'
              )}
            >
              Start
            </button>

            <button
              onClick={handleReset}
              className="rounded-full text-center py-2 px-10 bg-red-500"
            >
              RESET
            </button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-start">
          <h3 className="font-bold text-3xl">Enter Manually</h3>
          <input
            type="number"
            className="rounded-full text-center py-2 px-10"
          />
        </div>
      </div>
    </div>
  );
};

export default BreakComponent;
