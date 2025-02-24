import { KeyboardEvent, useState } from 'react';
import { IoIosClose, IoIosSearch } from 'react-icons/io';

interface SearchInputProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  className?: string;
}

export default function SearchInput({
  placeholder = '검색어를 입력하세요.',
  onSearch,
}: SearchInputProps) {
  const [value, setValue] = useState('');

  const handleSearch = (e: KeyboardEvent<HTMLInputElement>) => {
    if (onSearch && e.key === 'Enter') {
      onSearch(value);
    }
  };

  const handleButtonClick = () => {
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleReset = () => {
    setValue('');
  };

  return (
    <div className="relative flex items-center w-full">
      <button
        className="absolute left-0 top-3 text-zp-gray focus:outline-none"
        onClick={handleButtonClick}
      >
        <IoIosSearch size={20} fill="#73744a" />
      </button>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full py-2 pl-8 pr-4 border-b text-zp-gray placeholder-zp-light-gray focus:outline-none border-b-zp-main-color placeholder:text-zp-xs"
        onKeyDown={handleSearch}
      />
      <button className="absolute right-2 top-2.5" onClick={handleReset}>
        <IoIosClose size={24} fill="#73744a" />
      </button>
    </div>
  );
}
