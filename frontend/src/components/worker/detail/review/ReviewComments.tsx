import { useState } from 'react';
import { FaStar } from 'react-icons/fa';

import type { Comment } from '@/types';

const comments: Comment[] = [
  {
    id: 1,
    profilePic: 'https://via.placeholder.com/40',
    name: '홍길동',
    rating: 4,
    date: '24.07.17',
    content: '작업이 빠르고 깔끔하게 진행되었습니다.',
    replies: [
      {
        id: 1,
        profilePic: 'https://via.placeholder.com/40',
        name: '김철수',
        date: '24.07.18',
        content: '빠른 답변과 도움 감사드립니다!',
      },
    ],
  },
];

export default function ReviewComments() {
  const [showReplyBox, setShowReplyBox] = useState<number | null>(null);

  const handleReplyButtonClick = (commentId: number) => {
    setShowReplyBox(showReplyBox === commentId ? null : commentId);
  };

  return (
    <>
      <div className="font-bold text-zp-xs">리뷰</div>
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="p-4 mt-4 mb-4 rounded-zp-radius-big bg-zp-white"
        >
          <div className="flex items-center mb-2 space-x-4">
            <img
              src={comment.profilePic}
              alt="Profile"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <div className="font-bold text-zp-xs">{comment.name}</div>
              <div className="flex items-center space-x-1">
                {[...Array(comment.rating)].map((_, index) => (
                  <FaStar key={index} className="text-xs text-yellow-500" />
                ))}
                {[...Array(5 - comment.rating)].map((_, index) => (
                  <FaStar key={index} className="text-xs text-gray-300" />
                ))}
              </div>
              <div className="text-zp-gray text-zp-2xs">{comment.date}</div>
            </div>
          </div>
          <div className="text-zp-2xs">{comment.content}</div>
          <div className="flex justify-end">
            <button
              onClick={() => handleReplyButtonClick(comment.id)}
              className="font-bold text-zp-main-color text-zp-2xs"
            >
              댓글 달기
            </button>
          </div>
          {showReplyBox === comment.id && (
            <div className="p-4 mt-2 bg-zp-light-beige rounded-zp-radius-big">
              <textarea
                rows={3}
                placeholder="대댓글을 작성하세요..."
                className="w-full p-2 mt-2 border rounded border-zp-sub-color"
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => setShowReplyBox(null)}
                  className="font-bold text-zp-main-color text-zp-2xs"
                >
                  올리기
                </button>
              </div>
            </div>
          )}
          {comment.replies.map((reply) => (
            <div
              key={reply.id}
              className="p-4 mt-2 bg-zp-light-beige rounded-zp-radius-big"
            >
              <div className="flex items-center mb-2 space-x-4">
                <img
                  src={reply.profilePic}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex-1">
                  <div className="font-bold text-zp-xs">{reply.name}</div>
                  <div className="text-gray-500 text-zp-2xs">{reply.date}</div>
                </div>
              </div>
              <div className="text-zp-2xs">{reply.content}</div>
            </div>
          ))}
        </div>
      ))}
    </>
  );
}
