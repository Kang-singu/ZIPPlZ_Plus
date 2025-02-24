interface DropDownProps {
  options: string[];
  defaultOption: string;
  onSelect: (category: string) => void;
}

export default function DropDown({
  options,
  defaultOption,
  onSelect,
}: DropDownProps) {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onSelect(event.target.value);
  };

  return (
    <select
      onChange={handleChange}
      className="w-1/3 p-2 border outline-none rounded-zp-radius-big border-zp-main-color text-zp-2xs"
    >
      <option>{defaultOption}</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}
