import React from 'react';
import debounce from 'lodash/debounce';
import PropTypes from 'prop-types';
import { useKeyboard } from './useKeyboard';

export const useDebounceInput = React.memo((props) => {
  const { dependencies, callback, timeout = 1500 } = props;
  const [isKeyboardVisible] = useKeyboard();
  console.log('dependencies', dependencies);
  const arrDependencies = Object.keys(dependencies).map((key) => key);
  console.log('arrDependencies', arrDependencies);
  const handleChangeDependencies = (dependencies) =>
    typeof callback === 'function' && callback(dependencies);
  const _handleChangeDependencies = React.useRef(
    debounce(handleChangeDependencies, timeout),
  );
  React.useEffect(() => {
    if (_handleChangeDependencies && _handleChangeDependencies.current) {
      _handleChangeDependencies.current(dependencies);
    }
  }, arrDependencies);
  React.useEffect(() => {
    if (
      !isKeyboardVisible &&
      _handleChangeDependencies &&
      _handleChangeDependencies.current
    ) {
      _handleChangeDependencies.current(dependencies);
    }
  }, [isKeyboardVisible]);
});

useDebounceInput.defaultProps = {};

useDebounceInput.propTypes = {
  dependencies: PropTypes.object.isRequired,
  callback: PropTypes.func.isRequired,
  timeout: PropTypes.number,
};
