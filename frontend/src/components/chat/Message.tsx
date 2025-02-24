import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import { acceptContract, rejectContract } from '@apis/worker/ContractApi';
import Accepted from '@assets/accepted-icon.svg?react';
import Rejected from '@assets/rejected-icon.svg?react';
import Button from '@components/common/Button';
import { useLoginUserStore } from '@stores/loginUserStore';
import { formatTime } from '@utils/formatDateWithTime';

interface MessageProps {
  userSerial: number;
  chatMessageContent?: string;
  createdAt: string;
  fileType?: string;
  contract?: boolean;
  otherUserSerial: number;
  loading?: boolean;
}

export default function Message({
  userSerial,
  chatMessageContent,
  createdAt,
  fileType,
  contract,
  otherUserSerial,
  loading = false,
}: MessageProps) {
  const [contractHandled, setContractHandled] = useState<string | null>(null);

  let formattedImgUrl = '';
  if (fileType === 'IMAGE') {
    formattedImgUrl = `data:image/jpeg;base64,${chatMessageContent}`;
  } else if (fileType === 'FILE' && chatMessageContent) {
    formattedImgUrl = `data:text/plain;base64,${chatMessageContent}`;
  }

  const isAccepted = fileType === 'CONTRACT_ACCEPTED';
  const isRejected = fileType === 'CONTRACT_REJECTED';
  const isImage = fileType === 'IMAGE';
  const isFile = fileType === 'FILE';
  const { loginUser } = useLoginUserStore();
  const currUserSerial: number | undefined = loginUser?.userSerial;

  const handleAcceptContract = async () => {
    try {
      if (typeof currUserSerial === 'number') {
        const response = await acceptContract(otherUserSerial, currUserSerial);
        if (response.proc.code === 200) {
          setContractHandled('accepted');
        }
      }
    } catch (error) {
      console.error('계약 수락 중 에러가 발생했습니다:', error);
    }
  };

  const handleRejectContract = async () => {
    try {
      if (typeof currUserSerial === 'number') {
        const response = await rejectContract(otherUserSerial, currUserSerial);

        if (response.proc.code === 200) {
          setContractHandled('rejected');
        }
      }
    } catch (error) {
      console.error('계약 거절 중 에러가 발생했습니다:', error);
    }
  };

  return (
    <li
      className={`flex items-start px-4 py-2 ${
        userSerial === currUserSerial ? 'justify-end' : 'justify-start'
      }`}
    >
      {userSerial !== currUserSerial &&
        (loading ? (
          <Skeleton circle={true} height={32} width={32} className="mr-2" />
        ) : (
          <img
            className="w-8 mr-2 border border-zp-light-gray profile-img"
            src="https://i.pravatar.cc/50?img=1"
            alt="프로필 이미지"
          />
        ))}
      <div
        className={`p-2 rounded-zp-radius-bubble pb-2 text-zp-black max-w-[300px] min-w-[60px] drop-shadow-zp-normal bg-zp-white space-y-2 relative ${
          userSerial === currUserSerial
            ? 'text-right rounded-se-zp-radius-none'
            : 'text-left rounded-ss-zp-radius-none'
        }`}
      >
        {loading ? (
          <Skeleton count={2} />
        ) : isImage ? (
          <>
            {formattedImgUrl && (
              <img
                src={formattedImgUrl}
                alt="Message Image"
                className="max-w-[260px] max-h-[300px] object-cover"
              />
            )}
          </>
        ) : isFile ? (
          <a
            href={formattedImgUrl}
            download={formattedImgUrl}
            className={`hover:text-zp-black text-zp-gray underline ${
              fileType === 'FILE' ? 'line-clamp-2' : ''
            }`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {formattedImgUrl}
          </a>
        ) : (
          <p className="text-left whitespace-pre-wrap text-zp-gray text-zp-xs">
            {chatMessageContent}
          </p>
        )}
        {!loading &&
          contract &&
          !contractHandled &&
          !isAccepted &&
          !isRejected && (
            <div className="flex justify-end gap-2 mt-2">
              <Button
                type="button"
                buttonType="normal"
                width="full"
                height={1.5}
                fontSize="2xs"
                radius="btn"
                onClick={handleRejectContract}
              >
                거절
              </Button>
              <Button
                type="button"
                buttonType="second"
                width="full"
                height={1.5}
                fontSize="2xs"
                radius="btn"
                onClick={handleAcceptContract}
              >
                수락
              </Button>
            </div>
          )}
        {(contractHandled === 'accepted' || isAccepted) && (
          <div className="absolute z-50 w-40 -translate-x-1/2 -top-12 left-1/2 animate-zoom-in">
            <Accepted className="w-40" />
          </div>
        )}
        {(contractHandled === 'rejected' || isRejected) && (
          <div className="absolute z-50 w-40 -translate-x-1/2 -top-16 left-1/2 animate-zoom-in">
            <Rejected className="w-40" />
          </div>
        )}
        <p
          className={`text-zp-gray text-zp-3xs break-keep ${
            userSerial === currUserSerial ? 'text-left' : 'text-right'
          }`}
        >
          {loading ? <Skeleton width={40} /> : formatTime(createdAt)}
        </p>
      </div>

      {userSerial === currUserSerial &&
        (loading ? (
          <Skeleton circle={true} height={32} width={32} className="ml-2" />
        ) : (
          <img
            className="w-8 ml-2 border border-zp-light-gray profile-img"
            src="https://i.pravatar.cc/50?img=1"
            alt="프로필 이미지"
          />
        ))}
    </li>
  );
}
