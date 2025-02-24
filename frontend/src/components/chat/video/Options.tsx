import { useEffect, useState } from 'react';
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
} from 'react-icons/fa';
import { ImPhoneHangUp } from 'react-icons/im';
import { MdChecklistRtl, MdOutlineCameraswitch } from 'react-icons/md';
import { useParams } from 'react-router-dom';

import Contract from '@components/chat/Contract';
import FullModal from '@components/common/FullModal';
import { useLoginUserStore } from '@stores/loginUserStore';
import axios from 'axios';
import {
  Session as OVSession,
  OpenVidu,
  Publisher,
  Subscriber,
} from 'openvidu-browser';

interface OptionsProps {
  leaveSession: () => void;
  subscriber: Subscriber | null;
  publisher: Publisher;
  session: OVSession | null;
  OV: OpenVidu | null;
  setPublisher: (publisher: Publisher) => void;
  publishAudio: (enabled: boolean) => void;
  publishVideo: (enabled: boolean) => void;
  handleCloseVideo: () => void;
  startScreenShare: () => void;
}

const base_url = 'https://zipplz.site/api/';

export default function Options({
  leaveSession,
  publisher,
  session,
  OV,
  setPublisher,
  publishAudio,
  publishVideo,
  handleCloseVideo,
  startScreenShare,
}: OptionsProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isHided, setIsHided] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [name, setName] = useState('');
  const [isContractModalOpen, setIsContractModalOpen] = useState(false);
  const { chatroomSerial } = useParams<{ chatroomSerial?: string }>();
  // const { startRecording, stopRecording } = useOpenVidu();
  // const [onRecord, setOnRecord] = useState(false);
  const { loginUser } = useLoginUserStore();
  const userRole: string | undefined = loginUser?.role;

  const handleMute = () => {
    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    publishAudio(!newMuteState);
  };

  const handleHide = () => {
    const newHideState = !isHided;
    setIsHided(newHideState);
    publishVideo(!newHideState);
  };

  const getOtherUserName = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      const url = `${base_url}chatroom/${chatroomSerial}/name`;

      const response = await axios.get(url, { headers });

      if (response.status === 200 && response.data) {
        return response.data.data;
      } else {
        throw new Error('Unexpected response from the server');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to get other user name: ${errorMessage}`);
    }
  };

  const handleSwitch = async () => {
    if (OV && session) {
      try {
        const devices = await OV.getDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === 'videoinput'
        );

        if (videoDevices.length > 1) {
          const newPublisher = OV.initPublisher(undefined, {
            videoSource: isFrontCamera
              ? videoDevices[1].deviceId
              : videoDevices[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: isFrontCamera,
          });

          await session.unpublish(publisher);
          setPublisher(newPublisher);
          await session.publish(newPublisher);

          setIsFrontCamera(!isFrontCamera);
        } else {
          console.warn('No camera available to switch.');
        }
      } catch (error) {
        console.error('Failed to switch camera:', error);
      }
    } else {
      console.warn('No session or OpenVidu instance available.');
    }
  };

  const closeContractModal = () => {
    // stopScreenShare();
    setIsContractModalOpen(false);
  };

  const handleExitLive = () => {
    leaveSession();
    handleCloseVideo();
  };

  const handleSharingContract = () => {
    startScreenShare();
    setIsContractModalOpen(true);
  };

  const fetchName = async () => {
    try {
      const userName = await getOtherUserName();
      setName(userName);
    } catch (error) {
      console.error(
        error instanceof Error ? error.message : 'An unexpected error occurred'
      );
    }
  };

  useEffect(() => {
    fetchName();
  }, [chatroomSerial]);

  return (
    <div className="absolute bottom-0 flex w-10/12 pb-3 bg-opacity-50 rounded-zp-radius-big justify-evenly">
      <button
        className="drop-shadow-zp-deep btn hover:bg-zp-sub-color"
        onClick={handleMute}
      >
        {isMuted ? <FaMicrophoneSlash size={24} /> : <FaMicrophone size={24} />}
      </button>
      <button
        className="drop-shadow-zp-deep btn hover:bg-zp-sub-color"
        onClick={handleHide}
      >
        {isHided ? <FaVideoSlash size={24} /> : <FaVideo size={24} />}
      </button>
      <button
        className="drop-shadow-zp-deep btn hover:bg-zp-sub-color"
        onClick={handleSwitch}
      >
        <MdOutlineCameraswitch size={24} />
      </button>
      {userRole == 'worker' && (
        <button
          className="drop-shadow-zp-deep btn hover:bg-zp-sub-color"
          onClick={handleSharingContract}
        >
          <MdChecklistRtl size={28} />
        </button>
      )}
      <button
        className="drop-shadow-zp-deep bg-zp-red btn"
        onClick={handleExitLive}
      >
        <ImPhoneHangUp size={28} fill="#fff" />
      </button>
      <FullModal
        isOpen={isContractModalOpen}
        onRequestClose={closeContractModal}
        height="65%"
        maxWidth="400px"
      >
        <Contract closeContractModal={closeContractModal} name={name} />
      </FullModal>
    </div>
  );
}
