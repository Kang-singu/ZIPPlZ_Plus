import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { useParams } from 'react-router-dom';

import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { useLoginUserStore } from '@/stores/loginUserStore';
import { formatDate } from '@/utils/formatDateWithTime';
import { wirteWorkerReview } from '@apis/worker/PortfolioApi';

import BossReview from './BossReview';

interface Props {
  review: any;
}
export default function PortfolioReview({ review }: Props) {
  const [comment, setComment] = useState<string>('');
  const writeBossReview = async (reviewSerial: number, review: string) => {
    await wirteWorkerReview(reviewSerial, { reviewComment: review });
  };
  const { id } = useParams<{ id: string }>();
  const { loginUser } = useLoginUserStore();
  const [isWriteReview, setIsWriteReview] = useState<boolean>(false);
  return (
    <>
      <div className="flex flex-col gap-4 p-6 shadow-lg bg-zp-light-beige rounded-zp-radius-big">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <p className="font-bold text-zp-xs">{review.customerNickname}</p>
            <FaStar size={16} color="yellow" />
            <p className="font-bold text-zp-2xs">x {review.averageStar}</p>
          </div>
          <p className="text-zp-2xs">{formatDate(review.customerReviewDate)}</p>
        </div>
        <p className="text-zp-xs text-wrap">{review.customerReviewContent}</p>
        {id &&
          parseInt(id) === loginUser?.userSerial &&
          review.reviewComment === null && (
            <p
              className="text-right cursor-pointer text-zp-2xs"
              onClick={() => setIsWriteReview(!isWriteReview)}
            >
              댓글 달기
            </p>
          )}
      </div>
      {isWriteReview && (
        <div className="relative flex w-full gap-4 mt-2">
          <Input
            inputType="search"
            type="text"
            width="full"
            height={2}
            placeholder="리뷰 작성하기"
            radius="big"
            fontSize="xs"
            value={comment}
            onChange={(e: React.ChangeEvent) =>
              setComment((e.target as HTMLInputElement).value)
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
              writeBossReview(review.customerReviewSerial, comment);
              setIsWriteReview(false);
            }}
          />
          <IoChatbubbleEllipsesOutline
            size={16}
            className="absolute top-2 left-4"
          />
        </div>
      )}
      {review.reviewComment && <BossReview review={review.reviewComment} />}
    </>
  );
}
