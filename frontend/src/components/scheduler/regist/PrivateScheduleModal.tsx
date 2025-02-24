import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { addWork } from '@apis/scheduler/schedulerApi';
import Button from '@components/common/Button';
import Input from '@components/common/Input';

interface Props {
  newPrivateSchedule: string;
  closeModal: () => void;
  planSerial?: number;
}
export default function PrivateScheduleModal({
  newPrivateSchedule,
  closeModal,
  planSerial,
}: Props) {
  const navigate = useNavigate();
  const [start, setStart] = useState<string>('');
  const [end, setEnd] = useState<string>('');
  const [cost, setCost] = useState<number>(0);
  const handleRegister = async (
    fieldName: string,
    startDate: string,
    endDate: string,
    workPrice: number
  ) => {
    if (planSerial) {
      await addWork(planSerial, {
        fieldName: fieldName,
        startDate: startDate,
        endDate: endDate,
        workPrice: workPrice,
      });
      navigate(0);
      closeModal();
    }
  };
  return (
    <>
      <div className="absolute top-[0.8rem] left-[1rem] text-zp-xl font-bold flex items-center">
        {newPrivateSchedule}
      </div>
      <hr className="absolute top-[3rem] w-full border border-zp-sub-color" />
      <div className="w-full flex flex-col mt-[4rem] overflow-auto gap-4">
        <div className="flex gap-4 items-center">
          <p className="text-zp-xs font-bold">시공기간</p>
          <Input
            type="text"
            inputType="normal"
            fontSize="xs"
            height={1.5}
            width={6}
            radius="btn"
            placeholder="yyyy-mm-dd"
            value={start}
            onChange={(e: React.ChangeEvent) =>
              setStart((e.target as HTMLInputElement).value)
            }
          />
          ~
          <Input
            type="text"
            inputType="normal"
            fontSize="xs"
            height={1.5}
            width={6}
            radius="btn"
            placeholder="yyyy-mm-dd"
            value={end}
            onChange={(e: React.ChangeEvent) =>
              setEnd((e.target as HTMLInputElement).value)
            }
          />
        </div>
        <div className="flex gap-4 items-center">
          <p className="text-zp-xs font-bold">시공비용</p>
          <Input
            type="number"
            inputType="normal"
            fontSize="xs"
            height={1.5}
            width={6}
            radius="btn"
            placeholder="시공비용"
            value={cost.toString()}
            onChange={(e: React.ChangeEvent) =>
              setCost(parseInt((e.target as HTMLInputElement).value))
            }
          />
        </div>
        <div className="flex gap-4 justify-center items-center">
          <Button
            buttonType="second"
            children="등록"
            fontSize="xs"
            height={1.5}
            width={5}
            radius="btn"
            onClick={() => handleRegister(newPrivateSchedule, start, end, cost)}
          />
          <Button
            buttonType="second"
            children="취소"
            fontSize="xs"
            height={1.5}
            width={5}
            radius="btn"
            onClick={closeModal}
          />
        </div>
      </div>
    </>
  );
}
