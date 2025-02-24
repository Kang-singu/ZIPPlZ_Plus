import { FaRegTrashCan } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

import { deleteReview } from '@/apis/board/reviewApi';
import { useLoginUserStore } from '@/stores/loginUserStore';
import type { ReviewComment } from '@/types';
import { formatDate } from '@utils/formatDateWithTime';

interface Props {
  comment: ReviewComment;
}
export default function ChildReview({ comment }: Props) {
  const navigate = useNavigate();
  const { loginUser } = useLoginUserStore();
  const removeReview = async () => {
    if (comment) {
      await deleteReview(comment.commentSerial);
      navigate(0);
    }
  };
  return (
    <>
      <div className="pl-8">
        <div className="w-full h-['3rem'] border border-zp-main-color bg-zp-white flex flex-col gap-4 rounded-zp-radius-big py-2 px-4 ">
          <div className="flex items-center justify-between w-full text-zp-2xs">
            <div className="flex gap-1">
              <img
                className="w-3 h-3 rounded-zp-radius-full"
                src={comment.saveFile}
              />
              <p className="font-bold">
                {comment.nickName ? comment.nickName : comment.userName}
              </p>
              {comment?.userSerial === loginUser?.userSerial && (
                <FaRegTrashCan
                  size={12}
                  className="cursor-pointer"
                  onClick={removeReview}
                />
              )}
            </div>
            <p className="text-zp-gray">{formatDate(comment.commentDate)}</p>
          </div>
          <p className="text-zp-2xs">{comment.commentContent}</p>
        </div>
      </div>
    </>
  );
}
