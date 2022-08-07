import type { GetServerSideProps, NextPage } from 'next';
import { useState } from 'react';
import { trpc } from '../utils/trpc';
import dynamic from 'next/dynamic';
import BreakComponent from '@components/breakComponent/BreakComponent';

const DisplayTimesNoSSR = dynamic(
  () => import('@components/breakComponent/DisplayTimes'),
  { ssr: false }
);

export interface BreakTimerProps {
  cookies: Record<string, string>;
  rememberMe: string;
}

const BreakTimer: NextPage<BreakTimerProps> = (props: BreakTimerProps) => {
  return (
    <>
      <div className="container mx-auto flex flex-col items-center h-screen p-4">
        <BreakComponent cookies={props.cookies} />
        <button onClick={() => console.log(props.rememberMe)}></button>
        {/* <DisplayTimesNoSSR /> */}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  return {
    props: {},
  };
};

export default BreakTimer;
