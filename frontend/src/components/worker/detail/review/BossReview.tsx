interface Props {
  review: string;
}
export default function BossReview({ review }: Props) {
  return (
    <div className="w-full pl-6 mt-2">
      <div className="flex items-center gap-2">
        <img className="w-5 h-5 border rounded-zp-radius-full" src="" />
        <p className="font-bold text-zp-xs">시공업자</p>
      </div>
      <div className="flex flex-col gap-4 p-4 shadow-lg drop-shadow-zp-normal rounded-zp-radius-big">
        <p className="text-zp-xs text-wrap">{review}</p>
      </div>
    </div>
  );
}
