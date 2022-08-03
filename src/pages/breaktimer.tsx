import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { trpc } from '../utils/trpc';
import StopWatch2 from '@components/stopWatch/StopWatch2';
import DisplayTimes from '@components/stopWatch/DisplayTimes';
import dynamic from 'next/dynamic';

type TechnologyCardProps = {
  name: string;
  description: string;
  documentation: string;
};

const StopWatch2NoSSR = dynamic(() => import('@components/stopWatch/StopWatch2'), { ssr: false });
const DisplayTimesNoSSR = dynamic(() => import('@components/stopWatch/DisplayTimes'), { ssr: false });

const BreakTimer: NextPage = () => {
  const hello = trpc.useQuery(['example.hello', { text: 'from tRPC' }]);

  const [currentTime, setCurrentTime] = useState<Date>();
  const [maxBreakTime, setMaxBreakTime] = useState<number>(0);
  const [timer, setTimer] = useState(0);
  const [breakTimeLog, setBreakTimeLog] = useState<{ timeInSeconds: number; date: string }[]>([]);
  const StopWatchCallBack = (time: number) => {
    setTimer(time);
    setBreakTimeLog((prev) => [...prev, { timeInSeconds: time, date: new Date().toLocaleTimeString() }]);
  };

  const formatTime = (timer: number) => {
    const getSeconds = `0${timer % 60}`.slice(-2);
    const getMinutes = `0${Math.floor(timer / 60) % 60}`.slice(-2);
    const getHours = `0${Math.floor(timer / 3600)}`.slice(-2);

    return `${getHours} : ${getMinutes} : ${getSeconds}`;
  };

  const breakLengths = [15, 30, 45, 60, 90];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [currentTime]);

  // if (currentTime === undefined) {
  //   return <h1 className='h-screen w-full flex justify-center items-center text-5xl font-bold'>Loading ...</h1>;
  // }

  return (
    <>
      <div className='container mx-auto flex flex-col items-center h-screen p-4'>
        {/* <h1 className='select-none text-5xl'>Time now is: {currentTime.toLocaleTimeString()}</h1> */}

        {/* <input
          type='text'
          placeholder='Enter Break Time'
          className='rounded-full text-center p-1 mt-10 select-none'
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setBreakTime(
                Number((e.target as HTMLInputElement).value)
              );
            }
          }}
        /> */}
        <select
          name=''
          id=''
          className='rounded-full text-center p-1 mt-10 select-none text-black'
          onChange={(e) => {
            setMaxBreakTime(Number((e.target as HTMLSelectElement).value));
          }}
        >
          <option value=''>Select Break Time</option>
          {breakLengths.map((length) => (
            <option key={length} value={length}>
              {length}
            </option>
          ))}
        </select>

        <StopWatch2NoSSR setTimer={StopWatchCallBack}></StopWatch2NoSSR>

        <DisplayTimesNoSSR></DisplayTimesNoSSR>
      </div>
    </>
  );
};

const TechnologyCard = ({ name, description, documentation }: TechnologyCardProps) => {
  return (
    <section className='flex flex-col justify-center p-6 duration-500 border-2 border-gray-500 rounded shadow-xl motion-safe:hover:scale-105'>
      <h2 className='text-lg text-gray-700'>{name}</h2>
      <p className='text-sm text-gray-600'>{description}</p>
      <a
        className='mt-3 text-sm underline text-violet-500 decoration-dotted underline-offset-2'
        href={documentation}
        target='_blank'
        rel='noreferrer'
      >
        Documentation
      </a>
    </section>
  );
};

export default BreakTimer;
