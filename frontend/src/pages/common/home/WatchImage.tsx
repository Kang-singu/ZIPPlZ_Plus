import { useEffect, useState } from 'react';

import { useLoginUserStore } from '@/stores/loginUserStore';
import axios from 'axios';

export default function WatchImage() {
  const [imgList, setImgList] = useState<
    {
      fileSerial: number;
      saveFolder: string;
      originalFile: string;
      saveFile: string;
      fileName: string;
    }[]
  >([]);
  const getMyImages = async () => {
    return await axios.get(
      'https://zipplz.site/api/materials/converted-images',
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }
    );
  };
  const { loginUser } = useLoginUserStore();
  const fetchImages = async () => {
    const response = await getMyImages();
    setImgList(response.data.data);
  };
  useEffect(() => {
    fetchImages();
  }, []);
  const handleClickImageChange = () =>
    (window.location.href = `http://localhost:8080?user=${loginUser?.userSerial}`);
  return (
    <>
      <div className="grid w-full min-h-screen gap-0 sm:grid-cols-3 md:grid-cols-4 mb-[5rem]">
        {imgList && imgList.length > 0 ? (
          imgList.map((img) => (
            <img src={img.saveFile} className="w-full aspect-auto" />
          ))
        ) : (
          <p onClick={handleClickImageChange}>이미지 전환하러가기</p>
        )}
      </div>
    </>
  );
}
