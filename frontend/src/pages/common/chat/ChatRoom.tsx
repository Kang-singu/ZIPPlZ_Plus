import { useContext, useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';

import type { ChatRoomDetails } from '@/types';
import ChatRoomHeader from '@components/chat/ChatRoomHeader';
import Message from '@components/chat/Message';
import TextInputBox from '@components/chat/TextInputBox';
import ToggleChatMenu from '@components/chat/ToggleChatMenu';
import VideoModal from '@components/chat/video/VideoModal';
import FullModal from '@components/common/FullModal';
import { useChatStore } from '@stores/chatStore';
import { useLoginUserStore } from '@stores/loginUserStore';
import {
  WebSocketContext,
  WebSocketProvider,
} from '@utils/socket/WebSocketProvider';
import axios from 'axios';

const base_url = 'https://zipplz.site/api/';

function ChatRoomContent() {
  const { chatroomSerial } = useParams<{ chatroomSerial?: string }>();
  const roomIdNumber = chatroomSerial ? parseInt(chatroomSerial, 10) : NaN;
  const isValidRoomId = !isNaN(roomIdNumber);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const { selectedChatRoom, setSelectedChatRoom } = useChatStore();
  const [loading, setLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState<string | undefined>(undefined);
  const [fileSrc, setFileSrc] = useState<string | undefined>(undefined);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const { loginUser } = useLoginUserStore();
  const userSerial = loginUser?.userSerial;

  const { messages } = useContext(WebSocketContext) || { messages: [] };
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const handleClickVideo = () => {
    setIsVideoModalOpen(!isVideoModalOpen);
  };
  const fetchChatRoomDetails = async (
    chatroomSerial: number
  ): Promise<ChatRoomDetails> => {
    try {
      const response = await axios.get<{ data: ChatRoomDetails }>(
        `${base_url}chatroom/${chatroomSerial}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );

      return response.data.data;
    } catch (error) {
      console.error(
        'Error fetching chat room details:',
        error instanceof Error ? error.message : error
      );
      throw error;
    }
  };

  useEffect(() => {
    if (isValidRoomId) {
      setLoading(true);
      fetchChatRoomDetails(roomIdNumber)
        .then((data) => {
          setSelectedChatRoom(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Unable to load chat room details', error);
          setLoading(false);
        });
    }
  }, [roomIdNumber, isValidRoomId, setSelectedChatRoom]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleImagePreviewRemove = () => {
    setImageSrc(undefined);
  };

  if (loading) {
    return <p className="py-4 text-center bg-gray-300">Loading...</p>;
  }

  const handleCloseModal = () => {
    setIsVideoModalOpen(false);
  };
  return (
    <div className="relative flex flex-col h-screen bg-zp-light-orange">
      {isValidRoomId && selectedChatRoom && (
        <ChatRoomHeader
          name={selectedChatRoom.otherUser.name}
          certificated={selectedChatRoom.otherUser.certificated}
          location={selectedChatRoom.otherUser.location}
          fieldName={selectedChatRoom.otherUser.fieldName}
          imageUrl={selectedChatRoom.otherUser.image?.saveFile || ''}
          otherUserSerial={selectedChatRoom.otherUser.userSerial}
          handleClickVideo={handleClickVideo}
        />
      )}
      <div className="relative flex flex-col flex-grow overflow-y-auto">
        {isValidRoomId ? (
          <>
            <div className="flex-1 overflow-y-auto">
              {messages.map((msg, index) => (
                <Message
                  key={`${msg.userSerial}-${index}`}
                  chatMessageContent={msg.chatMessageContent}
                  createdAt={msg.createdAt}
                  userSerial={msg.userSerial}
                  fileType={msg.fileType}
                  contract={msg.contract}
                  otherUserSerial={selectedChatRoom?.otherUser.userSerial ?? 0}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
            <TextInputBox
              isMenuVisible={isMenuVisible}
              onMenuToggle={() => setMenuVisible((prev) => !prev)}
              userSerial={userSerial as number}
              onImagePreviewRemove={handleImagePreviewRemove}
              type="TALK"
              imageSrc={imageSrc}
              fileSrc={fileSrc}
            />
            {isMenuVisible && (
              <ToggleChatMenu
                name={selectedChatRoom?.otherUser.name}
                setImagePreview={setImageSrc}
                chatroomSerial={roomIdNumber}
                setFileSrc={setFileSrc}
              />
            )}
          </>
        ) : (
          <p className="py-4 text-center bg-zp-gray">Invalid room ID</p>
        )}
      </div>
      <FullModal
        isOpen={isVideoModalOpen}
        onRequestClose={() => setIsVideoModalOpen(false)}
        height="96%"
        maxWidth="580px"
      >
        <VideoModal handleCloseVideo={handleCloseModal} />
      </FullModal>
    </div>
  );
}

export default function ChatRoom() {
  return (
    <WebSocketProvider>
      <ChatRoomContent />
    </WebSocketProvider>
  );
}
