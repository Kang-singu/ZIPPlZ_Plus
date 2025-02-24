import { useEffect, useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { GoArrowLeft } from 'react-icons/go';
import {
  IoBookmark,
  IoBookmarkOutline,
  IoChatbubblesOutline,
} from 'react-icons/io5';
import { PiNotePencil } from 'react-icons/pi';
import { useNavigate, useParams } from 'react-router-dom';

import { writeReview } from '@/apis/board/reviewApi';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Review from '@/components/common/review/Review';
import WorkerCard from '@/components/home/WorkerCard';
import { useHousePostStore } from '@/stores/housePostStore';
import { useLoginUserStore } from '@/stores/loginUserStore';
import { formatDate } from '@/utils/formatDateWithTime';

export default function HousePostDetail({ onBookmarkChange = () => {} }) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const {
    fetchPostDetails,
    postDetails,
    deletePost,
    addWish,
    deleteWish,
    searchWish,
    selectedWorkers,
  } = useHousePostStore();

  useEffect(() => {
    if (id) {
      fetchPostDetails(Number(id)).then(() => {
        const token = `Bearer ${localStorage.getItem('token')}`;
        searchWish(token, Number(id)).then((response) => {
          setIsBookmarked(response.wish_count > 0);
        });
      });
    }
  }, []);

  const handleGoBack = () => {
    navigate('/housepost');
  };

  const handleBookmarkClick = async () => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const newBookmarkState = !isBookmarked;

    if (newBookmarkState) {
      const { code } = await addWish(token, Number(id), 2);
      if (code === 200) {
        setIsBookmarked(true);
        onBookmarkChange();
      } else {
        alert('관심 목록 추가에 실패했습니다.');
      }
    } else {
      const { code } = await deleteWish(token, Number(id));
      if (code === 200) {
        setIsBookmarked(false);
        onBookmarkChange();
      } else {
        alert('관심 목록 삭제에 실패했습니다.');
      }
    }
  };

  const handleEditClick = () => {
    navigate(`/HousePostUpdate/${postDetails?.boardSerial}`);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    const token = `Bearer ${localStorage.getItem('token')}`;
    const { code, message } = await deletePost(token, Number(id));

    if (code === 200) {
      alert('게시글이 성공적으로 삭제되었습니다.');
      navigate('/housepost');
    } else {
      alert(`게시글 삭제에 실패했습니다: ${message}`);
    }

    setIsDeleteModalOpen(false);
  };
  const [review, setReview] = useState<string>('');
  const handleClickRegistReview = async (
    boardSerial: number,
    review: string
  ) => {
    setReview('');
    return await writeReview({
      board_serial: boardSerial,
      comment_content: review,
      parent_comment_serial: -1,
      order_number: 0,
    });
  };
  const { loginUser } = useLoginUserStore();
  return (
    <>
      {postDetails && (
        <div className="flex flex-col min-h-screen gap-4 p-6">
          <GoArrowLeft
            className="mt-8 cursor-pointer "
            onClick={handleGoBack}
            size={20}
          />
          <div className="flex items-center justify-between ">
            <div className="flex items-center">
              <div className="font-bold text-zp-2xl">{postDetails.title}</div>
            {loginUser&&loginUser.role!==""&&
              <div
                className="ml-2 cursor-pointer"
                onClick={handleBookmarkClick}
              >
                {isBookmarked ? (
                  <IoBookmark size={20} color="#73744A" />
                ) : (
                  <IoBookmarkOutline size={20} />
                )}
              </div>}
            </div>
            {postDetails.userName === loginUser?.userName && (
              <div className="flex items-center">
                <div className="ml-2 cursor-pointer" onClick={handleEditClick}>
                  <PiNotePencil size={20} />
                </div>
                <div
                  className="ml-2 cursor-pointer"
                  onClick={handleDeleteClick}
                >
                  <FaRegTrashAlt size={20} />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between ">
            <div className="flex items-center gap-1">
              <img
                className="w-6 h-6 rounded-zp-radius-full"
                src={postDetails.saveFile}
              />
              <p className="text-zp-md text-zp-gray">{postDetails.nickname}</p>
            </div>
            <p className=" text-zp-xs text-zp-gray">
              {formatDate(postDetails.boardDate)}
            </p>
          </div>
          <div className="flex justify-center mt-4">
            {postDetails.images && postDetails.images.length > 0 ? (
              postDetails.images.map((image, index) => (
                <img
                  key={index}
                  src={image.saveFile}
                  alt={`post image ${index + 1}`}
                  className="rounded-lg shadow-md"
                />
              ))
            ) : (
              <div>No images available</div>
            )}
          </div>

          <div className="font-bold text-zp-sm">{postDetails.boardContent}</div>

          <div className="font-bold text-zp-xl">이 분들과 함께 했어요</div>

          <div
            className="flex w-full overflow-x-auto"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <div className="flex flex-nowrap overflow-auto w-full h-[8rem] "   style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}>
              {selectedWorkers.length > 0 ? (
                selectedWorkers.map((worker) => {
                  const safeWorker = {
                    ...worker,
                    locations: worker.locations || [],
                  };
                  return (
                    <WorkerCard
                      key={safeWorker.portfolio_serial}
                      worker={safeWorker}
                    />
                  );
                })
              ) : (
                <div>함께한 시공업자가 없습니다.</div>
              )}
            </div>
          </div>

          <div className="font-bold text-zp-xl">
            댓글 {postDetails.comments ? postDetails.comments.length : 0}개
          </div>

          <div className="flex flex-col gap-2">
            <p className="font-bold text-zp-lg">리뷰</p>
            {loginUser && loginUser.role !== '' && (
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
                    handleClickRegistReview(postDetails.boardSerial, review);
                    navigate(0);
                  }}
                />
                <IoChatbubblesOutline
                  size={16}
                  className="absolute top-2 left-4"
                />
              </div>
            )}
            {postDetails.comments &&
              postDetails.comments.length > 0 &&
              postDetails.comments.map((comment) => (
                <Review
                  comment={comment.parent_comment || undefined}
                  childComments={comment.child_comments || undefined}
                  key={comment.parent_comment?.commentSerial}
                />
              ))}
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 bg-zp-black">
          <div className="p-6 shadow-lg bg-zp-white rounded-zp-radius-big">
            <div className="mb-4 font-bold text-zp-lg">삭제 확인</div>
            <div className="mb-4">정말로 삭제하시겠습니까?</div>
            <div className="flex justify-end space-x-4">
              <div className="font-bold">
                <Button
                  children="취소"
                  buttonType="light"
                  width={8}
                  height={2.5}
                  fontSize="xs"
                  radius="full"
                  onClick={handleCloseModal}
                />
              </div>
              <div className="font-bold">
                <Button
                  children="삭제"
                  buttonType="second"
                  width={8}
                  height={2.5}
                  fontSize="xs"
                  radius="full"
                  onClick={handleConfirmDelete}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
