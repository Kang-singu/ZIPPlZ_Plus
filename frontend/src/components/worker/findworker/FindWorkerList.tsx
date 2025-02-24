import { useEffect } from 'react';

import { getFindWorkerList } from '@/apis/worker/WorkerListApi';
import { FindWorker, useWorkerListStore } from '@stores/workerListStore';

import FindWorkerListItem from './FindWorkerListItem';

export default function FindWorkerList() {
  const { findWorkerList, setFindWorkerList } = useWorkerListStore();
  const fetchFindWorkerList = async () => {
    const response = await getFindWorkerList();
    setFindWorkerList(response.data.data);
  };
  useEffect(() => {
    if (!findWorkerList) fetchFindWorkerList();
  }, []);
  return (
    <div className="flex flex-col gap-6 mb-[6rem] overflow-auto">
      {findWorkerList && findWorkerList.length > 0 ? (
        findWorkerList.map((item: FindWorker) => (
          <FindWorkerListItem board={item} />
        ))
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
    </div>
  );
}
