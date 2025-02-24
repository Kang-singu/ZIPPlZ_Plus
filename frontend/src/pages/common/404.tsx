import { Link } from 'react-router-dom';

import ErrorIcon from '@assets/error-icon.svg?react';

export default function Custom404() {
  return (
    <div className="flex items-center justify-center w-full h-screen overflow-hidden">
      <div className="flex flex-col items-center justify-center object-cover w-4/5 p-4 h-3/5">
        <div className="flex items-center justify-center w-full">
          <ErrorIcon className="w-full h-full" />
        </div>
        <Link
          to="/"
          className="mt-4 text-center underline text-content text-zp-md"
        >
          <span className="font-bold text-zp-md">HOME</span>으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
