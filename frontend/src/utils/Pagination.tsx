import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';

interface PaginationProps {
  total: number;
  limit: number;
  page: number;
  setPage: (page: number) => void;
}

export default function Pagination({
  total,
  limit,
  page,
  setPage,
}: PaginationProps) {
  const numPages = Math.ceil(total / limit);

  return (
    <div className="flex items-center justify-center my-4 gap-x-3">
      <button
        onClick={() => setPage(1)}
        disabled={page === 1}
        className="bg-zp-white"
      >
        <MdKeyboardDoubleArrowLeft />
      </button>
      <button
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        className="bg-zp-white"
      >
        <MdKeyboardArrowLeft />
      </button>
      <div className="flex space-x-1">
        {Array.from({ length: numPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setPage(index + 1)}
            className={`px-2 py-1 text-zp-2xs rounded-zp-radius-full ${page === index + 1 ? 'bg-zp-main-color text-zp-white' : 'bg-zp-sub-color'}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
      <button
        onClick={() => setPage(page + 1)}
        disabled={page === numPages}
        className="bg-zp-white"
      >
        <MdKeyboardArrowRight />
      </button>
      <button
        onClick={() => setPage(numPages)}
        disabled={page === numPages}
        className="bg-zp-white"
      >
        <MdKeyboardDoubleArrowRight />
      </button>
    </div>
  );
}
