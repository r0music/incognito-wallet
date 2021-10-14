import React from 'react';
import isEmpty from 'lodash/isEmpty';
import { View, Text } from '@src/components/core';
import { useError } from '@components/UseEffect/useError';
import styleSheet from './style';

export const RFError = React.memo(({ errMsg, style }) => {
  if (isEmpty(errMsg)) {
    return null;
  }
  return <Text style={[styleSheet.errorText, style]}>{errMsg}</Text>;
});

const customField = (field, render) => {
  const {
    style,
    componentProps,
    meta,
    warning,
    isCustomizeRenderError = false,
    isCustomizeRenderWarning = false,
    ...fieldProps
  } = field;
  const renderProps = {
    ...fieldProps,
    ...(typeof componentProps === 'object' ? componentProps : {}),
  };
  const shouldShowError =
    !isCustomizeRenderError &&
    (meta?.visited || meta?.touched || meta?.dirty) &&
    meta?.error;
  let shouldShowWarning =
    !isCustomizeRenderWarning &&
    (meta?.visited || meta?.touched) &&
    warning &&
    !meta?.error;
  const error = useError(shouldShowError ? meta.error : '');
  return (
    <View style={[styleSheet.container, style]}>
      <View style={styleSheet.field}>{render(renderProps)}</View>
      {!!shouldShowError && <RFError errMsg={error} />}
      {!!shouldShowWarning && (
        <Text style={styleSheet.warningText}>{warning}</Text>
      )}
    </View>
  );
};

const createField = ({ fieldName, render }) => (field) => {
  const CustomField = customField(field, render);
  CustomField.displayName = fieldName;
  return CustomField;
};

export default createField;
