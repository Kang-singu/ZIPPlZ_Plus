import type { Material } from '@/types';
import formatNumberWithCommas from '@utils/formatNumberWithCommas';

interface MaterialItemProps {
  material: Material;
  isSelected: boolean;
  onSelect: (serial: number) => void;
}

export default function MaterialItem({
  material,
  isSelected,
  onSelect,
}: MaterialItemProps) {
  return (
    <div
      onClick={() => onSelect(material.materialSerial)}
      className={`flex items-center justify-between p-1 border-b cursor-pointer 
    ${isSelected ? 'bg-zp-sub-color' : 'bg-zp-transparent'} 
    border-zp-sub-color`}
    >
      <div className="flex items-center">
        <img
          src={material.img.saveFile}
          alt={material.materialName}
          className="object-cover w-12 mr-2 aspect-square"
        />
        <h3
          className={`mr-2 font-bold truncate min-w-16 max-w-24 text-zp-xs ${isSelected ? 'text-zp-black' : 'text-zp-gray'}`}
        >
          {material.materialName}
        </h3>
        <p
          className={`min-w-12 line-clamp-2 max-h text-zp-2xs ${isSelected ? 'text-zp-black' : 'text-zp-gray'}`}
        >
          {material.description}
        </p>
      </div>
      <p
        className={`text-zp-gray text-zp-xs break-keep ${isSelected ? 'text-zp-black' : 'text-zp-gray'}`}
      >
        {formatNumberWithCommas(material.materialPrice)}원
      </p>
    </div>
  );
}
