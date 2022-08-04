import { GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
import { getCookie, setCookie } from 'typescript-cookie';

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
    JSON.parse(props.rememberMe) || false
  );

  useEffect(() => {
    setCookie('rememberMe', rememberMe);
  }, [rememberMe]);

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
