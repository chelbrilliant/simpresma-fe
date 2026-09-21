import DropdownSelect from "./DropdownSelect";

interface Option {
  value: string;
  label: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onChange: (value: string) => void;
  className?: string;
  defaultValue?: string;
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder = "Select an option",
  onChange,
  className = "",
  defaultValue = "",
}) => {
  return (
    <DropdownSelect
      options={[
        { value: "", label: placeholder },
        ...options,
      ]}
      defaultValue={defaultValue}
      onChange={onChange}
      className={className}
    />
  );
};

export default Select;
