import { FaHammer } from 'react-icons/fa';

interface Props {
  scores: number[];
}

export default function MannerTemperature({ scores }: Props) {
  return (
    <>
      <div className="flex flex-col w-full gap-6">
        <div className="flex flex-col w-full gap-2 font-bold text-zp-xs">
          <p className="flex gap-1">
            <FaHammer size={20} color="#00B3FF" />
            매너 온도
          </p>
          <div className="w-full h-5 bg-zp-sub-color rounded-zp-radius-big">
            <div
              className="flex items-center justify-end h-full bg-zp-main-color rounded-zp-radius-big"
              style={{ width: `${scores[0]}%` }}
            >
              <span className="pr-2 text-zp-3xs text-zp-white">
                {scores[0]}°C
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full gap-2 p-4 font-bold shadow-lg text-zp-2xs bg-zp-light-beige rounded-zp-radius-big">
          <div className="flex items-center w-full gap-2">
            <p className="basis-1/5">기술</p>
            <div className="h-5 basis-3/4 rounded-zp-radius-big">
              <div
                className="h-full bg-zp-yellow rounded-zp-radius-big"
                style={{ width: `${scores[1] * 20}%` }}
              />
            </div>
            <p className="basis-1/12 ">{scores[1]}</p>
          </div>
          <div className="flex items-center w-full gap-2">
            <p className="basis-1/5">커뮤니케이션</p>
            <div className="h-5 basis-3/4 rounded-zp-radius-big">
              <div
                className="h-full bg-zp-yellow rounded-zp-radius-big"
                style={{ width: `${scores[2] * 20}%` }}
              />
            </div>
            <p className="basis-1/12 text-">{scores[2]}</p>
          </div>
          <div className="flex items-center w-full gap-2">
            <p className="basis-1/5">작업완성도</p>
            <div className="h-5 basis-3/4 rounded-zp-radius-big">
              <div
                className="h-full bg-zp-yellow rounded-zp-radius-big"
                style={{ width: `${scores[3] * 20}%` }}
              />
            </div>
            <p className="basis-1/12 text-">{scores[3]}</p>
          </div>
          <div className="flex items-center w-full gap-2">
            <p className="basis-1/5">태도</p>
            <div className="h-5 basis-3/4 rounded-zp-radius-big">
              <div
                className="h-full bg-zp-yellow rounded-zp-radius-big"
                style={{ width: `${scores[4] * 20}%` }}
              />
            </div>
            <p className="basis-1/12 text-">{scores[4]}</p>
          </div>
        </div>
      </div>
    </>
  );
}
