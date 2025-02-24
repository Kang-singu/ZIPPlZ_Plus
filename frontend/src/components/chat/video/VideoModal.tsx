import Options from '@components/chat/video/Options';
import Session from '@components/chat/video/Session';
import useOpenVidu from '@hooks/useOpenvidu';
import { Publisher, Subscriber } from 'openvidu-browser';

interface VideoModalProps {
  handleCloseVideo: () => void;
}

export default function VideoModal({ handleCloseVideo }: VideoModalProps) {
  const {
    session,
    publisher,
    subscriber,
    leaveSession,
    // setSubscriber,
    setPublisher,
    startScreenShare,
    OV,
  } = useOpenVidu();

  const publishAudio = (enabled: boolean) => {
    if (publisher) {
      publisher.publishAudio(enabled);
    }
  };

  const publishVideo = (enabled: boolean) => {
    if (publisher) {
      publisher.publishVideo(enabled);
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-screen text-white bg-zp-light-orange">
      <div className="flex flex-col w-full h-full rounded-zp-radius-big">
        {session && (
          <Session
            publisher={publisher as Publisher}
            subscriber={subscriber as Subscriber}
            // setSubscriber={setSubscriber}
          />
        )}
      </div>
      <Options
        leaveSession={leaveSession}
        publisher={publisher as Publisher}
        subscriber={subscriber as Subscriber}
        session={session}
        OV={OV}
        setPublisher={setPublisher}
        publishAudio={publishAudio}
        publishVideo={publishVideo}
        handleCloseVideo={handleCloseVideo}
        startScreenShare={startScreenShare}
      />
    </div>
  );
}
