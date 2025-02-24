import { TbPhoto } from 'react-icons/tb';

import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

const photos = [
  '사진1',
  '사진2',
  '사진3',
  '사진4',
  '사진5',
  '사진6',
  '사진7',
  '사진8',
];

export default function Photos() {
  return (
    <>
      <div className="flex items-center w-full h-6 mt-6 space-x-1 font-bold text-zp-xs">
        <TbPhoto />
        <div>Photos</div>
      </div>
      <Swiper
        spaceBetween={10}
        slidesPerView={3}
        modules={[Navigation]}
        navigation
        className="w-full"
      >
        {photos.map((photo, index) => (
          <SwiperSlide key={index} className="flex items-center justify-center">
            <div className="rounded-zp-radius-big bg-zp-white flex items-center justify-center w-full h-[150px] p-2">
              <button className="flex items-center justify-center w-full h-full text-zp-xs bg-zp-light-gray">
                {photo}
              </button>
            </div>
          </SwiperSlide>
        ))}
        <div className="flex justify-between">
          <button className="swiper-button-prev text-zp-black"></button>
          <button className="swiper-button-next text-zp-black"></button>
        </div>
      </Swiper>
    </>
  );
}
