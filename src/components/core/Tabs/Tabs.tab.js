import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { FONT } from '@src/styles';
import styled from 'styled-components/native';
import nextFrame from '@src/utils/nextFrame';

const styles = StyleSheet.create({
  btnStyle: {
    marginRight: 24,
    paddingBottom: 16,
  },
  btnStyleEnabled: {
    borderBottomColor: '#1A73E8',
    borderBottomWidth: 2,
  },
  btnStyleDisabled: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  titleStyle: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.regular,
  },
  titleDisabledStyle: {},
});

const CustomText = styled(Text)`
  color: ${({ disabled, theme }) => (disabled ? theme.text11 : theme.text1)};
  line-height: 24px;
`;

const Tab = (props) => {
  const {
    activeTab,
    label,
    onClickTab,
    tabID,
    tabStyled,
    tabStyledEnabled,
    tabStyledDisabled,
    titleStyled,
    titleDisabledStyled,
  } = props;
  const onClick = async () => {
    await nextFrame();
    typeof onClickTab === 'function' && onClickTab(tabID);
  };
  const disabled = tabID !== activeTab;
  return (
    <TouchableOpacity
      onPress={onClick}
      style={
        tabStyled
          ? [tabStyled, disabled ? tabStyledDisabled : null]
          : [
            styles.btnStyle,
            disabled
              ? styles.btnStyleDisabled
              : { ...styles.btnStyleEnabled, ...tabStyledEnabled },
          ]
      }
    >
      <CustomText
        disabled={disabled}
        style={
          titleStyled
            ? [titleStyled, disabled && titleDisabledStyled]
            : [styles.titleStyle, disabled ? styles.titleDisabledStyle : null]
        }
      >
        {label}
      </CustomText>
    </TouchableOpacity>
  );
};

Tab.defaultProps = {
  tabStyled: null,
  titleStyled: null,
  tabStyledDisabled: null,
  titleDisabledStyled: null,
  tabStyledEnabled: {},
};

Tab.propTypes = {
  activeTab: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onClickTab: PropTypes.func.isRequired,
  tabID: PropTypes.string.isRequired,
  tabStyled: PropTypes.any,
  tabStyledDisabled: PropTypes.any,
  titleStyled: PropTypes.any,
  titleDisabledStyled: PropTypes.any,
  tabStyledEnabled: PropTypes.any,
};

export default React.memo(Tab);
