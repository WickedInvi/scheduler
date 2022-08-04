import type { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import { trpc } from '../utils/trpc';
import dynamic from 'next/dynamic';
import StopWatchWithCookies from '@components/stopWatch/StopWatchWithCookies';
import TestComponent from '@components/stopWatch/TestComponent';
import cookie from 'cookie';
import { prisma } from '@server/db/client';
import { format } from 'date-fns';

const StopWatch2NoSSR = dynamic(() => import('@components/stopWatch/StopWatch2'), { ssr: false });
const DisplayTimesNoSSR = dynamic(() => import('@components/stopWatch/DisplayTimes'), { ssr: false });

type TechnologyCardProps = {
  name: string;
  description: string;
  documentation: string;
};
type cookies = {
  name: string;
  value: string;
};
export interface BreakTimerProps {
  cookies: cookies[];
  rememberMe: string;
}

const BreakTimer: NextPage<BreakTimerProps> = (props: BreakTimerProps) => {
  const hello = trpc.useQuery(['example.hello', { text: 'from tRPC' }]);
  // const [isActive, setIsActive] = useState(getCookie('rememberMe'));

  const [currentTime, setCurrentTime] = useState<Date>();
  const [maxBreakTime, setMaxBreakTime] = useState<number>(0);
  const [timer, setTimer] = useState(0);
  const [breakTimeLog, setBreakTimeLog] = useState<{ timeInSeconds: number; date: string }[]>([]);
  const StopWatchCallBack = (time: number) => {
    setTimer(time);
    setBreakTimeLog((prev) => [...prev, { timeInSeconds: time, date: new Date().toLocaleTimeString() }]);
  };

  return (
    <>
      <div className='container mx-auto flex flex-col items-center h-screen p-4'>
        {/* <StopWatch2NoSSR></StopWatch2NoSSR> */}
        {/* <StopWatchWithCookies /> */}
        <button onClick={() => console.log(props.rememberMe)}></button>
        <TestComponent rememberMe={props.rememberMe} />
        <DisplayTimesNoSSR />
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

function parseCookies(req: any) {
  return cookie.parse(req ? req.headers.cookie || '' : document.cookie);
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const posts = await prisma.post.findMany();
  console.log('posts', posts);

  const cookies = parseCookies(req);

  if (cookies.rememberMe) {
    return { props: { cookies, rememberMe: cookies.rememberMe } };
  }
  return { props: { cookies, rememberMe: false } };
};

export default BreakTimer;
