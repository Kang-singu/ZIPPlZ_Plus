interface Props {
  field: string;
  handleClickField: () => void;
}
export default function FieldListItem({ field, handleClickField }: Props) {
  const imageSrc = `/svg/mainpage/${field}.svg`;

  return (
    <>
      <div className="flex flex-col items-center w-full gap-1">
        <div
          className="flex p-2 cursor-pointer aspect-square bg-zp-white rounded-zp-radius-big drop-shadow-zp-slight"
          onClick={handleClickField}
        >
          <img src={imageSrc} />
        </div>
        <p className="font-bold text-zp-3xs font-noto">{field}</p>
      </div>
    </>
  );
}
