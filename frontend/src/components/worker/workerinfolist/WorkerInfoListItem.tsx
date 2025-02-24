import { useNavigate } from 'react-router-dom';

import NoImage from '@assets/no-image-icon.svg?react';
import { CertificatedBadge } from '@assets/svg/icons';
import Tooltip from '@utils/Tooltip';

interface Props {
  worker: any;
}
export default function WorkerInfoListItem({ worker }: Props) {
  const navigate = useNavigate();
  return (
    <div
      className="flex flex-col w-['30%'] bg-zp-white rounded-zp-radius-big cursor-pointer h-[10rem] drop-shadow-zp-slight justify-center"
      onClick={() =>
        navigate(`/workers/${worker.user_serial}/portfolio?tab=overview`)
      }
    >
      {worker.img ? (
        <img
          className="w-full h-[35%] basis-3/5 object-cover transform scale-125 origin-top"
          src={worker.save_file}
        />
      ) : (
        <div className="flex items-center basis-3/5 justify-center w-full h-[50%] overflow-hidden">
          <NoImage height="full" />
        </div>
      )}
      <div className="flex flex-col w-full px-4 py-2 basis-2/5">
        <div className="flex items-center gap-1">
          <p className="font-bold text-zp-gray text-zp-xs">
            {worker.user_name}
          </p>
          {worker.certificated_badge > 0 && (
            <Tooltip text="사업자등록번호 인증 뱃지">
              <CertificatedBadge width={16} height={16} />
            </Tooltip>
          )}
        </div>
        <p className="text-zp-3xs text-zp-light-gray">{worker.temperature}</p>
        {worker.locations.map((region: string) => (
          <p className="text-zp-3xs text-zp-light-gray">{region}</p>
        ))}
        <p className=" text-zp-3xs text-zp-gray">
          {worker.field_name} | &nbsp;경력 {worker.career}년
        </p>
      </div>
    </div>
  );
}
