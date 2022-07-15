import SelectNetworkForUnshieldInput from '@src/components/core/SelectNetworkForUnshieldInput';
import React from 'react';
import createField from './createField';

const renderCustomField = ({
  input,
  items,
  networks,
  selectedNetwork,
  ...props
}) => {
  const { onChange, value } = input;
  return (
    <SelectNetworkForUnshieldInput
      {...props}
      items={items}
      onChange={onChange}
      value={value}
      networks={networks}
      selectedNetwork={selectedNetwork}
    />
  );
};

const SelectNetworkFiled = createField({
  fieldName: 'SelectNetworkFiled',
  render: renderCustomField,
});

export default SelectNetworkFiled;
