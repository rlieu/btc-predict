import React, { ChangeEvent, FC } from 'react';

interface SearchInputProps {
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const SearchInput: FC<SearchInputProps> = ({ value, onChange }) => {
  return (
    <input
      type="text"
      placeholder="Search"
      className="input__search"
      value={value}
      onChange={onChange}
    />
  );
};

export default SearchInput;
