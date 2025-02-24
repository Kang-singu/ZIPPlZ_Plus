import { FaCheck } from 'react-icons/fa';

interface Props {
  onChange: () => void;
  checked: boolean;
}
export default function Checkbox({ onChange, checked }: Props) {
  return (
    <div className="relative w-[1.5rem] h-[1.5rem]">
      <input
        type="checkbox"
        className="w-full h-full border appearance-none cursor-pointer bg-zp-white border-zp-main-color checked:bg-zp-main-color rounded-zp-radius-full"
        onChange={onChange}
        checked={checked}
      />
      <FaCheck
        size={16}
        className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none top-1/2 left-1/2 text-zp-white"
      />
    </div>
  );
}
