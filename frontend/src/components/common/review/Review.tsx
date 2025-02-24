import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { FaRegTrashCan } from 'react-icons/fa6';
import { IoChatbubblesOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

import { deleteReview, writeReview } from '@/apis/board/reviewApi';
import { useLoginUserStore } from '@/stores/loginUserStore';
import { Comment } from '@/stores/workerListStore';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import { formatDate } from '@utils/formatDateWithTime';

import ChildReview from './ChildReview';

interface Props {
  comment?: Comment;
  childComments?: Comment[];
}
export default function Review({ comment, childComments }: Props) {
  const { loginUser } = useLoginUserStore();
  const navigate = useNavigate();
  const [isWriteReview, setIsWriteReview] = useState<boolean>(false);
  const [isShowReview, setIsShowReview] = useState<boolean>(false);
  const showReview = () => {
    setIsShowReview(!isShowReview);
  };
  const showWriteReview = () => {
    setIsWriteReview(!isWriteReview);
  };
  const removeReview = async () => {
    if (comment) {
      await deleteReview(comment.commentSerial);
      navigate(0);
    }
  };
  const [review, setReview] = useState<string>('');
  const handleClickRegistReview = async (
    boardSerial: number,
    review: string,
    parent: number,
    order: number
  ) => {
    setReview('');
    return await writeReview({
      board_serial: boardSerial,
      comment_content: review,
      parent_comment_serial: parent,
      order_number: order,
    });
  };
  return (
    <>
      <div className="w-full h-['7rem'] border border-zp-main-color bg-zp-white flex flex-col gap-4 rounded-zp-radius-big py-4 px-6">
        <div className="flex items-center justify-between w-full text-zp-2xs">
          <div className="flex gap-1">
            <img
              className="w-3 h-3 rounded-zp-radius-full"
              src={comment && comment.saveFile}
            />
            <p className="font-bold">
              {comment?.nickName ? comment.nickName : comment?.userName}
            </p>
            {comment?.userSerial === loginUser?.userSerial && (
              <FaRegTrashCan
                size={12}
                className="cursor-pointer"
                onClick={removeReview}
              />
            )}
          </div>
          {comment && (
            <p className="text-zp-gray">{formatDate(comment.commentDate)}</p>
          )}
        </div>
        <p className="text-zp-2xs">{comment?.commentContent}</p>
        <div className="flex items-center gap-4 font-bold text-zp-2xs">
          <div
            className="flex items-center gap-1 cursor-pointer"
            onClick={showReview}
          >
            {isShowReview ? (
              <FaChevronUp size={12} />
            ) : (
              <FaChevronDown size={12} />
            )}
            {childComments && childComments.length}개 댓글보기
          </div>
          {loginUser && loginUser.role !== '' && (
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={showWriteReview}
            >
              <IoChatbubblesOutline size={12} />
              답글 작성하기
            </div>
          )}
        </div>
      </div>
      {isWriteReview && loginUser && loginUser.role !== '' && (
        <div className="relative flex w-full gap-4">
          <Input
            inputType="search"
            type="text"
            width="full"
            height={2}
            placeholder="리뷰 작성하기"
            radius="big"
            fontSize="xs"
            value={review}
            onChange={(e: React.ChangeEvent) =>
              setReview((e.target as HTMLInputElement).value)
            }
          />
          <Button
            buttonType="second"
            children="등록"
            fontSize="xs"
            height={2}
            width={4}
            radius="btn"
            onClick={() => {
              if (comment)
                setTimeout(() => {
                  handleClickRegistReview(
                    comment?.boardSerial,
                    review,
                    comment?.commentSerial,
                    0
                  );
                }, 1500);
              navigate(0);
            }}
          />
          <IoChatbubblesOutline size={16} className="absolute top-2 left-4" />
        </div>
      )}
      {isShowReview &&
        childComments &&
        childComments.map((comment) => (
          <ChildReview comment={comment} key={comment.commentSerial} />
        ))}
    </>
  );
}
