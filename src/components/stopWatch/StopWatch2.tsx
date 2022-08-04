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

export interface StopWatch2Props {}

const StopWatch2: React.FC<StopWatch2Props> = (props: StopWatch2Props) => {
  let localStorageBreakTimeLog = localStorage.getItem('breakTimeLog')
    ? JSON.parse(localStorage.getItem('breakTimeLog') || '[]')
    : [];

  const [isActive, setIsActive] = useState(
    localStorage.getItem('isActive') === 'true' ? true : false
  );

  const [breakTimeLog, setBreakTimeLog] = useState<
    { timeInSeconds: number; date: string }[]
  >(localStorageBreakTimeLog);

  // Settings
  const minBreakTime = 0;
  let today = startOfToday();

  const breakTimeLengths = [
    {
      shiftLength: 4 * 60,
      breakTime: 15,
    },
    {
      shiftLength: 8 * 60,
      breakTime: 30,
    },
    {
      shiftLength: 11 * 60,
      breakTime: 60,
    },
    {
      shiftLength: 24 * 60,
      breakTime: 90,
    },
  ];

  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();

  // CURRENT TIME
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // MAX BREAK TIME
  const [maxBreakTime, setMaxBreakTime] = useState<number | undefined>(0);

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
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTime]);

  useEffect(() => {
    localStorage.setItem('breakTimeLog', JSON.stringify(breakTimeLog));
  }, [breakTimeLog]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
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
    let breakTime = breakTimeLengths.find(
      (breakTime) => shiftLengthInMin <= breakTime.shiftLength
    );
    setMaxBreakTime(breakTime?.breakTime);
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

  // MANUAL BREAK HANDLER
  const manualBreakHandler = () => {
    localStorageStopHandler();
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
      setBreakTimeLog((prev) => [
        ...prev,
        { timeInSeconds: timer, date: format(new Date(), 'HH:mm:ss') },
      ]);
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
    console.log(maxBreakTime);
  };

  const handleShiftTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempTime = addTimeToDate(today, e.target.value);

    addTimeToDate(today, e.target.value);

    if (e.target.id == 'shiftStartTime') setStartTime(tempTime);
    if (e.target.id == 'shiftEndTime') setEndTime(tempTime);
  };

  return (
    <div className="flex flex-col gap-10 ">
      <h1 className="select-none text-5xl">
        Time now is: {format(currentTime, 'HH:mm:ss')}
      </h1>
      <div>
        <div className="flex gap-10 mb-10 justify-center">
          <div className="flex flex-col items-center">
            <p>For debugging</p>
            <label htmlFor="">Enter Start Time</label>
            <input
              type="time"
              id="shiftStartTime"
              className="text-black text-center max-w-max rounded-full pl-2"
              onChange={handleShiftTimeChange}
            />
            <label htmlFor="">Enter Finish Time</label>
            <input
              type="time"
              id="shiftEndTime"
              onChange={handleShiftTimeChange}
              className="text-black text-center max-w-max rounded-full pl-2"
            />
          </div>
          <div className="flex flex-col items-center">
            <p>Start Time</p>
            <p>{format(todayStartTime, 'HH:mm')}</p>
          </div>
          <div className="flex flex-col items-center">
            <p>End Time</p>
            <p>{format(todayEndTime, 'HH:mm')}</p>
          </div>
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

export default StopWatch2;
