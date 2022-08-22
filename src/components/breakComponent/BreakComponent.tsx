import { differenceInSeconds, format, startOfToday } from 'date-fns';
import React, { useState, useRef, useEffect } from 'react';
import {
  formatSecondsForDisplay,
  dateFromLocalStorage,
  addTimeToDate,
  classNames,
} from './helpers';

// Components
import DisplayTimes from './displayTimes/DisplayTimes';

// Types
import type { BreakTimeLog } from './types';

import ShiftTimes from '@components/breakComponent/shiftTimes/ShiftTimes';
import BreakTimer from './BreakTimer';

interface BreakComponentProps {}

const BreakComponent = ({}: BreakComponentProps) => {
  const [isActive, setIsActive] = useState<boolean>();

  // TODO Use DB for this
  const [breakTimeLog, setBreakTimeLog] = useState<BreakTimeLog[]>([]);

  // Settings
  const minBreakTime = 0;
  let today = startOfToday();

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
    // Fixes server side render issue
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

  // useEffect(() => {
  //   localStorage.setItem('breakTimeLog', JSON.stringify(breakTimeLog));
  // }, [breakTimeLog]);

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
        if (prev !== undefined) {
          return [
            ...prev,
            {
              date: startOfToday(),
              timeInSeconds: timer,
              timeOfBreak: new Date(),
            },
          ];
        } else {
          return [
            {
              date: startOfToday(),
              timeInSeconds: timer,
              timeOfBreak: new Date(),
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

  const handleClick = () => {};

  if (!currentTime) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row gap-10 border-2">
      <div>
        <div>
          <div>
            <ShiftTimes day={today} />
          </div>
          <button className="bg-red-500" onClick={handleClick}>
            Click Me
          </button>
          <div className="flex flex-col items-center justify-start">
            <div className="flex items-center gap-5">
              <button
                onClick={handleStartStopClick}
                disabled={canTakeBreak}
                className={classNames(
                  'btn px-8 btn-success',
                  isActive && 'btn-error',
                  canTakeBreak && 'btn-ghost'
                )}
              >
                Start
              </button>

              <button onClick={handleReset} className="btn bg-red-500">
                RESET
              </button>
            </div>
            <h3 className="font-bold text-xl">Break Timer</h3>
            <BreakTimer label="Current break" timer={timer} />
            <BreakTimer label="Time since last break" timer={lastBreakTimer} />
          </div>
        </div>
      </div>
      <div className="min-w-[420px]">
        <DisplayTimes breakTimeLog={breakTimeLog} />
      </div>
    </div>
  );
};

export default BreakComponent;
