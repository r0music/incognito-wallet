import React from 'react';
import { StyleSheet, Clipboard } from 'react-native';
import { ButtonBasic } from '@src/components/Button';
import { View3 } from '@src/components/core/View';
import { Text9 } from '@src/components/core/Text';
import { FONT } from '@src/styles';
import PropTypes from 'prop-types';
import { Toast , TouchableOpacity } from '@src/components/core';
import IconCopy2 from '../Icons/icon.copy2';

const styled = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 3,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
  },
  text: {
    flex: 1,
    fontFamily: FONT.NAME.medium,
    fontSize: FONT.SIZE.regular,
    lineHeight: FONT.SIZE.regular + 6,
    marginHorizontal: 15,
  },
  buttonCopy: {
    marginRight: 16,
  },
});

const CopiableText = props => {
  const { data, textStyle, btnStyle } = props;
  // const [copied, setCopied] = React.useState(false);
  const handleCopyText = () => {
    Clipboard.setString(data);
    // setCopied(true);
    Toast.showSuccess('Copied');
  };
  return (
    <View3 style={styled.container}>
      <Text9
        style={[styled.text, textStyle]}
        numberOfLines={1}
        ellipsizeMode="middle"
      >
        {data}
      </Text9>
      {/* <ButtonBasic
        btnStyle={[styled.btnStyle, btnStyle]}
        titleStyle={styled.titleStyle}
        title={copied ? 'Copied' : 'Copy'}
        onPress={handleCopyText}
      /> */}
      <TouchableOpacity onPress={handleCopyText} style={styled.buttonCopy}>
        <IconCopy2 />
      </TouchableOpacity>
    </View3>
  );
};

CopiableText.defaultProps = {
  textStyle: undefined
};

CopiableText.propTypes = {
  data: PropTypes.string.isRequired,
  textStyle: PropTypes.any
};

export default CopiableText;
