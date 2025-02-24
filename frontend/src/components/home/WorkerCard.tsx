import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router-dom';

interface Props {
  worker: any;
}

export default function WorkerCard({ worker }: Props) {
  const navigate = useNavigate();
  // worker와 관련된 필드가 존재하는지 확인
  // const location =
  //   worker.locations && worker.locations.length > 0
  //     ? worker.locations[0]
  //     : '위치 정보 없음';
  // const fieldName = worker.field_name || '분야 정보 없음';
  // const temperature = worker.temperature || '온도 정보 없음';

  return (
    <div className="relative flex flex-col justify-end flex-shrink-0 h-full px-5 cursor-pointer sm:w-1/3 md:w-1/3">
      {worker.user_name ? (
        <div
          className="px-4 profile-card"
          style={{ width: '100%', height: '80%' }}
          onClick={() => {
            navigate(`/workers/${worker.user_serial}/portfolio?tab=overview`);
          }}
        >
          <div className="profile-img absolute top-[-25%] w-[60%]">
            {/* {worker.save_file ? ( */}
            <img
              className="object-cover w-full h-full rounded-zp-radius-full"
              src={worker.save_file}
            />
            {/* ) : ( */}
            {/* <Skeleton circle={true} height={60} width={60} /> */}
            {/* )} */}
          </div>

          <p className="md:mt-[30%] mt-[50%] font-bold text-zp-2xs">
            {worker.user_name || '이름 없음'}
          </p>
          <p className="text-zp-3xs text-nowrap">{worker.locations[0]}</p>
          {worker.locations.length > 1 && (
            <>
              <p className="text-zp-3xs text-nowrap">{worker.locations[1]}</p>
              {worker.locations.length > 2 && (
                <p className="text-zp-3xs">...</p>
              )}
            </>
          )}
          <div className="flex justify-center gap-2">
            <p className="text-zp-3xs text-nowrap">{worker.field_name}</p>
            <p className="text-zp-3xs">|</p>
            <p className="text-zp-3xs text-nowrap">{worker.temperature}</p>
          </div>
        </div>
      ) : (
        <Skeleton width={30} height={20} />
      )}
    </div>
  );
}
