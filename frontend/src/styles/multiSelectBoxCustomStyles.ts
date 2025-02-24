import { StylesConfig } from 'react-select';

const multiSelectBoxCustomStyles: StylesConfig<any, true> = {
  control: (provided, state) => ({
    ...provided,
    boxShadow: 'none',
    borderColor: state.isFocused ? '#ccc' : provided.borderColor,
    '&:hover': {
      borderColor: '#73744A ',
    },
  }),
  menu: (provided) => ({
    ...provided,
    border: '1px solid #ccc',
    overflow: 'scroll',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  }),
  menuList: (provided) => ({
    ...provided,
    height: 50,
    fontSize: '12px',
    overflowY: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: '#ebebeb',
    fontSize: '13px',
    ':hover': {
      backgroundColor: '#F6F7E2',
    },
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    backgroundColor: '#ebebeb',
    ':hover': {
      backgroundColor: '#F6F7E2',
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    maxHeight: 145,
    display: 'flex',
    alignItems: 'center',
    overflow: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#F6F7E2' : provided.backgroundColor,
    color: state.isSelected ? '#73744A' : provided.color,
  }),
};

export default multiSelectBoxCustomStyles;
