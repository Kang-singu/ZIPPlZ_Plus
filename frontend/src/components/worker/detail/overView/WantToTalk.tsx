import { RiMessage2Line } from 'react-icons/ri';

export default function WantToTalk() {
  return (
    <>
      <div className="mt-6 w-full h-6 font-bold text-zp-xs flex justify-start space-x-1">
        <div>
          <RiMessage2Line />
        </div>
        <div>하고 싶은 말</div>
      </div>
      <div className="w-full h-24 bg-zp-white p-4 rounded-zp-radius-big font-bold">
        <div className="text-zp-2xs flex flex-col space-y-2">
          <div>잘 부탁드려요</div>
        </div>
      </div>
    </>
  );
}
