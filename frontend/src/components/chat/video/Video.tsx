import { forwardRef, useEffect } from 'react';

import { StreamManager } from 'openvidu-browser';

interface VideoProps {
  streamManager: StreamManager;
}

const Video = forwardRef<HTMLVideoElement, VideoProps>(
  ({ streamManager }, ref) => {
    useEffect(() => {
      if (streamManager && ref && 'current' in ref && ref.current) {
        streamManager.addVideoElement(ref.current);
      }
    }, [streamManager, ref]);

    return (
      <video
        autoPlay
        ref={ref}
        className="flex justify-center object-cover w-full h-full overflow-hidden max-h-[300px] rounded-zp-radius-big"
      >
        <track kind="captions" />
      </video>
    );
  }
);

export default Video;
