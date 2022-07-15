import PropTypes from 'prop-types';
import React from 'react';
import { SelectItem } from './SelectOption.modalSelectItem';

const SelectOptionInput = (props) => {
  const { options, actived, ...rest } = props;

  return <SelectItem {...actived} itemStyled={{ marginBottom: 0 }} {...rest} />;
};

SelectOptionInput.propTypes = {
  actived: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
};

export default React.memo(SelectOptionInput);
