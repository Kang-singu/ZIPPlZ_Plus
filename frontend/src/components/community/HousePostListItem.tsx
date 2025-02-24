import { FaRegBookmark, FaRegComment, FaRegEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { formatDate } from '@/utils/formatDateWithTime';

interface Board {
  board_serial: number;
  board_type: number;
  user_serial: number;
  img: string;
  title: string;
  nickname: string;
  user_name: string;
  save_file: string;
  board_date: string;
  hit: number;
  comment_cnt: number;
  wish_cnt: number;
}
interface Props {
  board: Board;
}
export default function HousePostListItem({ board }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="flex flex-col p-2 border shadow-lg h-60 rounded-zp-radius-big border-zp-light-beige"
      onClick={() => navigate(`/housepost/${board.board_serial}`)}
    >
      {/* 이미지 */}
      <div className="flex items-center justify-center w-full">
        {board.img && (
          <img
            src={board.img}
            alt="Post"
            className="object-cover w-full h-15 rounded-t-zp-radius-big"
          />
        )}
      </div>
      {/* 제목 */}
      <div className="mt-2 font-bold text-left text-zp-xs">{board.title}</div>
      {/* 프로필 및 닉네임 */}
      <div className="flex items-center mt-2">
        <img
          src={board.save_file}
          alt="Profile"
          className="w-6 h-6 rounded-full"
        />
        <div className="ml-2 text-zp-sm">{board.nickname}</div>
      </div>
      {/* 업로드 날짜 */}
      <div className="mt-1 text-zp-2xs text-zp-gray">
        {formatDate(board.board_date)}
      </div>
      {/* 조회수, 북마크, 댓글 */}
      <div className="flex items-center mt-2 space-x-2">
        <div className="flex items-center text-zp-2xs">
          <FaRegEye className="mr-1" /> {board.hit}
        </div>
        <div className="flex items-center text-zp-2xs">
          <FaRegBookmark className="mr-1" /> {board.wish_cnt}
        </div>
        <div className="flex items-center text-zp-2xs">
          <FaRegComment className="mr-1" /> {board.comment_cnt}
        </div>
      </div>
    </div>
  );
}
