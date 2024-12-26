import React, { ChangeEvent, FC } from 'react';
import { AssistantModel } from '@/models/assistants';

interface SelectInputProps {
  options: AssistantModel[];
  // value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const SelectInput: FC<SelectInputProps> = ({ options, onChange }) => {
  return (
    <select className="input__select" onChange={onChange}>
      {options.map(option => (
        <option key={option.id} value={option.id}>
          {option.assistant_name}
        </option>
      ))}
    </select>
  );
};

export default SelectInput;
