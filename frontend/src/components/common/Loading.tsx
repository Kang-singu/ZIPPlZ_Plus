import { FadeLoader } from 'react-spinners';

export default function Loading() {
  return (
    <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/3 left-1/2">
      <FadeLoader />
    </div>
  );
}
