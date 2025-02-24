import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

import { formatDateWithTime } from './../../../utils/formatDateWithTime';

interface Props {
  schedule: any;
  idx: number;
  planSerial?: number;
}
export default function SchedulerCardCustom({ schedule, idx }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const cardHeight: string = isOpen ? '7rem' : '4rem';
  const handleClickChevron = function () {
    setIsOpen(!isOpen);
  };
  return (
    <>
      <div
        className="relative flex flex-col w-full justify-center items-center rounded-zp-radius-big bg-zp-white drop-shadow-zp-normal"
        style={{ height: cardHeight }}
      >
        <div className="absolute top-5 flex justify-between items-center w-full px-6 ">
          <div className="flex items-center gap-1 text-zp-xl font-bold">
            {idx} {schedule.fieldName}
            {schedule.isCompleted > 0 && (
              <IoMdCheckmarkCircleOutline size={16} color="#34C759" />
            )}
          </div>
          <div>
            {isOpen ? (
              <FaChevronUp
                className="cursor-pointer"
                size={16}
                onClick={handleClickChevron}
              />
            ) : (
              <FaChevronDown
                className="cursor-pointer"
                width={16}
                height={16}
                onClick={handleClickChevron}
              />
            )}
          </div>
        </div>
        {isOpen && (
          <div className="flex flex-col w-full mt-[2.5rem] gap-[0.75rem] p-6">
            <hr className="w-full border-zp-light-gray" />
            <p className="text-zp-2xs font-bold">
              {' '}
              기간 : {
                formatDateWithTime(schedule.startDate).split(' ')[0]
              } ~ {formatDateWithTime(schedule.endDate).split(' ')[0]}
            </p>
            <p className="text-zp-2xs font-bold">
              {' '}
              시공 비용 : {schedule.workPrice}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
