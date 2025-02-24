import { CgProfile } from 'react-icons/cg';
import { CiBookmark } from 'react-icons/ci';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { FaRegEye } from 'react-icons/fa6';
import { IoChatbubbleEllipsesOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

import { FindWorker } from '@stores/workerListStore';
import { formatDate } from '@utils/formatDateWithTime';

interface Props {
  board: FindWorker;
}
export default function FindWorkerListItem({ board }: Props) {
  const navigate = useNavigate();
  return (
    <div
      className="w-full rounded-zp-radius-big h-[7.5rem] drop-shadow-zp-normal flex items-center bg-zp-white cursor-pointer p-4"
      onClick={() => navigate(`${board.board_serial}`)}
    >
      <div className="flex items-center w-full h-full gap-4">
        <div className="flex flex-col justify-center h-full gap-2 pr-2 border-r border-r-zp-light-gray basis-3/5">
          <p className="font-bold text-zp-xs">{board.title}</p>
          <p className="text-zp-xs line-clamp-3">{board.board_content}</p>
        </div>
        <div className="flex flex-col gap-2 basis-2/5">
          <div className="flex items-center gap-1">
            <CgProfile size={12} />{' '}
            <p className="text-zp-2xs text-zp-gray">{board.nickname}</p>
          </div>
          <div className="flex items-center gap-1">
            <FaRegCalendarAlt size={12} />
            <p className="text-zp-2xs text-zp-gray">
              {formatDate(board.board_date)}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <FaRegEye size={12} />
            <p className="text-zp-2xs text-zp-gray">{board.hit}</p>
            <CiBookmark size={12} />
            <p className="text-zp-2xs text-zp-gray">{board.wish_cnt}</p>
            <IoChatbubbleEllipsesOutline size={12} />
            <p className="text-zp-2xs text-zp-gray">{board.comment_cnt}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
