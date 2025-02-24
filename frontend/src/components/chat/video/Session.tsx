import { useRef } from 'react';

import Video from '@components/chat/video/Video';
import { Publisher, Subscriber } from 'openvidu-browser';

interface SessionProps {
  subscriber: Subscriber;
  publisher: Publisher;
}

export default function Session({ subscriber, publisher }: SessionProps) {
  const publisherRef = useRef<HTMLVideoElement>(null);
  const subscriberRef = useRef<HTMLVideoElement>(null);

  return (
    <div className="relative flex flex-col items-center justify-center h-full p-4 space-y-4">
      <div className={`relative basis-1/2 ${subscriber ? '' : 'blur'}`}>
        <Video streamManager={publisher} ref={publisherRef} />
      </div>
      {subscriber ? (
        <div className="relative basis-1/2">
          <Video streamManager={subscriber} ref={subscriberRef} />
        </div>
      ) : (
        <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full ">
          <p className="text-zp-white">상대방이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
