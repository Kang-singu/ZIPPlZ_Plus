import {
  ChangeEvent,
  KeyboardEvent,
  useContext,
  useEffect,
  useState,
} from 'react';
import { FaPlus } from 'react-icons/fa';
import { FiSend } from 'react-icons/fi';
import { IoIosClose } from 'react-icons/io';

import Circle from '@assets/gradient-circle.svg?react';
import TextArea from '@components/common/TextArea';
import { WebSocketContext } from '@utils/socket/WebSocketProvider';

type TextInputBoxType = 'TALK' | 'IMAGE' | 'FILE' | 'CONTRACT';

interface TextInputBoxProps {
  isMenuVisible: boolean;
  onMenuToggle: () => void;
  userSerial: number;
  onImagePreviewRemove: () => void;
  type: TextInputBoxType;
  imageSrc?: string;
  fileData?: { name: string; type: string; url: string };
  fileSrc?: string;
}

export default function TextInputBox({
  isMenuVisible,
  onMenuToggle,
  userSerial,
  imageSrc,
  onImagePreviewRemove,
  fileSrc,
}: TextInputBoxProps) {
  const context = useContext(WebSocketContext);

  if (!context) {
    throw new Error('TextInputBox must be used within a WebSocketProvider');
  }

  const { sendMessage } = context;
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (imageSrc || fileSrc) {
      onMenuToggle();
    }
  }, [imageSrc, fileSrc]);

  const handleChangeText = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (message.trim() || imageSrc || fileSrc) {
      if (imageSrc) {
        try {
          const base64Regex = /^data:image\/(png|jpeg|jpg);base64,/;
          const match = imageSrc.match(base64Regex);
          let fileName = 'image';
          let fileExtension = 'png';

          if (match) {
            fileExtension = match[1];
            fileName = `image_${Date.now()}.${fileExtension}`;
          }
          const response = await fetch(imageSrc);
          const blob = await response.blob();
          const file = new File([blob], fileName, {
            type: `image/${fileExtension}`,
          });

          sendMessage(imageSrc, userSerial, file, 'IMAGE');
          onImagePreviewRemove();
        } catch (error) {
          console.error('Error creating file from image preview:', error);
        }
      } else if (fileSrc) {
        const getExtensionFromMimeType = (mimeType: string): string => {
          const mimeTypes: { [key: string]: string } = {
            'text/plain': 'txt',
            'image/jpeg': 'jpg',
            'image/png': 'png',
          };

          return mimeTypes[mimeType] || 'bin';
        };

        try {
          const base64Regex = /^data:(.*);base64,/;
          const match = fileSrc.match(base64Regex);
          let fileName = 'file';
          let mimeType = 'application/octet-stream';
          let fileExtension = 'txt';

          if (match) {
            mimeType = match[1];
            fileExtension = getExtensionFromMimeType(mimeType);
            fileName = `file_${Date.now()}.${fileExtension}`;
          }

          const base64Content = fileSrc.split(',')[1];

          const byteCharacters = atob(base64Content);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: mimeType });

          const file = new File([blob], fileName, { type: mimeType });

          sendMessage(fileSrc, userSerial, file, 'FILE');
        } catch (error) {
          console.error('Error creating file from fileSrc URL:', error);
        }
      } else {
        sendMessage(message, userSerial);
        setMessage('');
      }
    }
  };

  return (
    <div className="sticky bottom-0 flex items-center justify-between w-full gap-3 px-4 my-3 max-h-12 bg-zp-transparent">
      <button className="relative" onClick={onMenuToggle}>
        <Circle width={28} height={28} />
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
          style={{
            transform: isMenuVisible ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s',
          }}
        >
          <FaPlus size={14} className="min-w-[22px] cursor-pointer" />
        </div>
      </button>
      <TextArea
        placeholder="메시지를 입력하세요."
        className="relative py-2 overflow-hidden leading-6 align-middle max-h-12"
        fontSize="sm"
        width="full"
        height={10}
        value={message}
        onChange={handleChangeText}
        onKeyDown={handleKeyDown}
      />
      {imageSrc && (
        <div className="absolute bg-white border rounded w-18 max-w-24 right-20 bottom-14 border-zp-light-gray z-4">
          <img src={imageSrc} alt="Preview" className="w-full h-auto" />
          <button
            onClick={onImagePreviewRemove}
            className="absolute top-0 right-0"
          >
            <IoIosClose size={20} />
          </button>
        </div>
      )}
      <button onClick={handleSendMessage} className="p-2 cursor-pointer">
        <FiSend size={20} />
      </button>
    </div>
  );
}
