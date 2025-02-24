import { MdElectricalServices } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

interface WorkerInfo {
  user_serial: number;
  portfolio_serial: number;
  name: string;
  birth_date: number;
  temp: number;
  field_id: number;
  field_name: string;
  career: number;
  certificated_badge: number;
  locations: string[];
  img: string;
}
interface Props {
  worker: WorkerInfo;
}
export default function WorkerInfoListItem({ worker }: Props) {
  const navigate = useNavigate();

  const formatLocations = (locations: string[] | undefined) => {
    return locations?.join(', ') ?? '';
  };

  return (
    <div
      className="flex flex-col items-center h-48 p-2 border shadow-lg rounded-zp-radius-big border-zp-light-beige"
      onClick={() => navigate('/OverView')}
    >
      <div className="flex items-center justify-center">
        {worker && <img src={worker.img} alt="Profile" />}
      </div>
      <div className="flex flex-col items-start px-2">
        <div className="flex items-center mb-2 space-x-2">
          <div className="font-bold text-left text-zp-sm">
            {worker && worker.name}
          </div>
          <div className="text-zp-2xs text-zp-gray">
            {worker && worker.birth_date}년생
          </div>
          {worker && worker.certificated_badge === 1 && (
            <MdElectricalServices />
          )}
        </div>
        <div className="text-zp-2xs">{worker && `${worker.temp}°C`}</div>
        <div className="mb-2 text-zp-2xs">
          {worker && <div>{formatLocations(worker.locations)}</div>}
        </div>
        <div className="space-x-2">
          <span className="font-bold text-left text-zp-2xs">
            {worker && worker.field_name}
          </span>
          <span className="text-zp-2xs">
            {worker && `경력 ${worker.career}년`}
          </span>
        </div>
      </div>
    </div>
  );
}
