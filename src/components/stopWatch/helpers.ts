import { add, differenceInMinutes } from 'date-fns';
import { MutableRefObject } from 'react';
import { JSONArray, JSONObject } from 'superjson/dist/types';

export const formatSecondsForDisplay = (seconds: number) => {
  const getSeconds = `0${seconds % 60}`.slice(-2);
  const getMinutes = `0${Math.floor(seconds / 60) % 60}`.slice(-2);
  const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);

  return `${getHours} : ${getMinutes} : ${getSeconds}`;
};

export const dateFromLocalStorage = (localStorageKey: string) => {
  return new Date(Number(localStorage.getItem(localStorageKey)));
};

export const getHoursFromString = (time: string) => {
  if (time) {
    const [hours] = time.split(':');
    return Number(hours);
  }
  return 0;
};

export const getMinutesFromString = (time: string) => {
  if (time) {
    const [_, minutes] = time.split(':');
    return Number(minutes);
  }
  return 0;
};
type Time = {
  hours: number;
  minutes: number;
  seconds: number;
};

export const parseTimeFromString = (time: string): Time => {
  if (time) {
    let [hours, minutes, seconds] = time.split(':');

    if (!seconds) seconds = '00';
    if (!minutes) minutes = '00';
    if (!hours) hours = '00';

    return {
      hours: Number(hours),
      minutes: Number(minutes),
      seconds: Number(seconds),
    };
  }

  return { hours: 0, minutes: 0, seconds: 0 };
};

export const isCurrentTimeWithin30minutesOfStartTime = (startTime: Date | undefined) => {
  if (startTime) {
    const currentTime = new Date();
    const diffMinutes = Math.floor(differenceInMinutes(currentTime, startTime));
    console.log(diffMinutes);
    return diffMinutes <= 30;
  }
  return false;
};

export const addTimeToDate = (date: Date, time: string): Date => {
  return add(date, {
    hours: parseTimeFromString(time).hours,
    minutes: parseTimeFromString(time).minutes,
  });
};

export const toggleClasses = (ref: MutableRefObject<any>, id: number, classes: string[]) => {
  classes.forEach((className) => {
    ref.current[id].classList.toggle(className);
  });
};

export const classNames = (...classes: any[]) => {
  return classes.filter(Boolean).join(' ');
};
