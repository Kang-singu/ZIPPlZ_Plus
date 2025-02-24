import { useContext, useEffect, useState } from 'react';

import type { Material } from '@/types';
import { getMaterials } from '@apis/worker/MaterialApi';
import NothingIcon from '@assets/nothing-icon.svg?react';
import MaterialItem from '@components/chat/MaterialItem';
import Button from '@components/common/Button';
import DropDown from '@components/common/DropDown';
import SearchInput from '@components/common/SearchInput';
import Pagination from '@utils/Pagination';
import formatNumberWithCommas from '@utils/formatNumberWithCommas';
import { WebSocketContext } from '@utils/socket/WebSocketProvider';

interface MaterialProps {
  closeMaterialModal: () => void;
  chatroomSerial: number;
}

const categoryMap: { [key: string]: number } = {
  벽면재: 0,
  바닥재: 1,
};

export default function Material({
  closeMaterialModal,
  chatroomSerial,
}: MaterialProps) {
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null
  );
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(4);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { sendMessage } = useContext(WebSocketContext) || {
    sendMessage: () => {},
  };

  const fetchMaterials = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMaterials();
      setPage(1);
      setMaterials(response.data.data);
    } catch (err) {
      setError('자재를 가져오는 데 실패했습니다.');
      console.log('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 380) {
        setPerPage(5);
      } else {
        setPerPage(6);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const filteredMaterials = materials.filter(
    (material) =>
      material.materialName.includes(searchQuery) &&
      (selectedCategory !== null
        ? material.majorCategory === selectedCategory
        : true)
  );

  const numPages = Math.ceil(filteredMaterials.length / perPage);
  const offset = (page - 1) * perPage;

  useEffect(() => {
    if (page > numPages) {
      setPage(numPages);
    }
  }, [numPages]);

  const handleSelectMaterial = (serial: number) => {
    const material = materials.find((mat) => mat.materialSerial === serial);
    setSelectedMaterial(material || null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(categoryMap[category] || null);
  };

  const handleConfirm = () => {
    if (selectedMaterial) {
      const message = `
 ✨ 선택한 자재 ✨
 
   📦 자재명: ${selectedMaterial.materialName}
   📄 상세설명: ${selectedMaterial.description}
   💰 가격: ${formatNumberWithCommas(selectedMaterial.materialPrice)}원
  `;
      sendMessage(message, chatroomSerial);
      closeMaterialModal();
    }
  };

  if (loading) {
    return <div className="text-center text-zp-gray">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-zp-red">{error}</div>;
  }

  return (
    <div className="flex flex-col justify-between w-full h-full p-4 bg-zp-white">
      <div className="flex flex-col gap-3">
        <h2 className="font-bold text-center text-zp-2xl">자재 고르기</h2>
        <div className="flex items-center justify-between gap-x-2">
          <DropDown
            options={['벽면재', '바닥재']}
            onSelect={handleCategoryChange}
            defaultOption="모든 자재"
          />
          <SearchInput
            onSearch={handleSearch}
            placeholder="자재명을 검색하세요."
          />
        </div>
        <div className="flex flex-col w-full">
          {filteredMaterials.length === 0 ? (
            <div className="flex flex-col items-center">
              <p className="text-center text-zp-gray text-zp-sm">
                해당하는 자재가 없습니다.
              </p>
              <NothingIcon className="absolute w-10/12 -translate-y-1/2 top-1/2" />
            </div>
          ) : (
            filteredMaterials
              .slice(offset, offset + perPage)
              .map((material) => (
                <MaterialItem
                  key={material.materialSerial}
                  material={material}
                  isSelected={
                    selectedMaterial?.materialSerial === material.materialSerial
                  }
                  onSelect={handleSelectMaterial}
                />
              ))
          )}
        </div>
      </div>
      <div className="flex flex-col">
        {filteredMaterials.length > 0 && (
          <Pagination
            total={filteredMaterials.length}
            limit={perPage}
            page={page}
            setPage={setPage}
          />
        )}
        <div className="flex gap-2">
          <Button
            type="button"
            buttonType="normal"
            width="full"
            height={2.5}
            fontSize="xl"
            radius="btn"
            onClick={closeMaterialModal}
          >
            닫기
          </Button>
          <Button
            type="button"
            buttonType="primary"
            width="full"
            height={2.5}
            fontSize="xl"
            radius="btn"
            onClick={handleConfirm}
          >
            확인
          </Button>
        </div>
      </div>
    </div>
  );
}
