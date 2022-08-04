import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { getCookie, setCookie } from 'typescript-cookie';
import { trpc } from 'utils/trpc';

type cookies = {
  name: string;
  value: string;
};

export interface testComponentProps {
  // cookies: cookies[];
  rememberMe: string;
}

const TestComponent: React.FC<testComponentProps> = (
  props: testComponentProps
) => {
  const [rememberMe, setRememberMe] = useState<boolean>(
    props.rememberMe ? JSON.parse(props.rememberMe) : false
  );
  const posts = trpc.useQuery(['posts.getAll']);

  useEffect(() => {
    setCookie('rememberMe', rememberMe);
    console.log('hello', posts.data);
  }, [rememberMe]);

  if (posts.isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <input
        type="checkbox"
        checked={rememberMe}
        onChange={(e: any) => {
          setRememberMe(e.target.checked);
          console.log(e.target.checked);
        }}
      />
      <button
        onClick={() => {
          console.log(rememberMe);
        }}
      >
        Click
      </button>
    </div>
  );
};

export default TestComponent;
