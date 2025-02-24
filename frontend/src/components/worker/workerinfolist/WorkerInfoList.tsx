import { useEffect } from 'react';

import {
  getWorkerList,
  getWorkerListByField,
} from '@/apis/worker/WorkerListApi';
import WorkerInfoListItem from '@/components/worker/workerinfolist/WorkerInfoListItem';
import { useWorkerListStore } from '@/stores/workerListStore';

interface Props {
  field?: number;
  keyword: string;
  searchWorker: () => void;
}
export default function WorkerInfoList({
  field,
  keyword,
  searchWorker,
}: Props) {
  const { workerList, setWorkerList } = useWorkerListStore();
  const fetchWorkerList = async () => {
    const response = await getWorkerList();
    setWorkerList(response.data.data);
  };
  const fetchWorkerListByField = async (field: number) => {
    const response = getWorkerListByField(field);
    setWorkerList((await response).data.data);
  };

  useEffect(() => {
    if (field && field > 0) {
      if (keyword !== '') searchWorker();
      else fetchWorkerListByField(field);
    } else {
      if (keyword !== '') searchWorker();
      else fetchWorkerList();
    }
  }, [field]);
  return (
    <>
      {workerList && workerList.length > 0 ? (
        <div className="grid w-full grid-cols-3 h-full overflow-auto gap-4 sm:grid-cols-3 md:grid-cols-4 auto-rows-[10rem]">
          {workerList.map((worker: any) => (
            <WorkerInfoListItem worker={worker} key={worker.protfolioSerial} />
          ))}
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center justify-center w-full ">
            <img src="/nothing-icon.svg" className="w-[60%] aspect-square" />
            <p className="font-bold text-zp-md text-zp-light-gray">
              존재하는 게시물이 없습니다.
            </p>
          </div>
        </>
      )}
    </>
  );
}
