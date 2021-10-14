import React from 'react';
import { StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { ButtonBasic } from '@src/components/Button';
import { COLORS } from '@src/styles';

const styled = StyleSheet.create({
  btnStyle: {
    flex: 1,
    height: '100%'
  },
  btnStyleEnabled: {
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    backgroundColor: COLORS.white,
  },
  btnStyleDisabled: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  titleStyle: {
    color: COLORS.colorBlue,
  },
  titleDisabledStyle: {
    color: COLORS.colorGreyMedium,
  },
});

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
  const onClick = () => typeof onClickTab === 'function' && onClickTab(tabID);
  const disabled = tabID !== activeTab;
  return (
    <ButtonBasic
      title={label}
      onPress={onClick}
      btnStyle={
        tabStyled
          ? [tabStyled, disabled ? tabStyledDisabled : null]
          : [
            styled.btnStyle,
            disabled ? styled.btnStyleDisabled : { ...styled.btnStyleEnabled, ...tabStyledEnabled },
          ]
      }
      titleStyle={
        titleStyled
          ? [titleStyled, disabled && titleDisabledStyled]
          : [styled.titleStyle, disabled ? styled.titleDisabledStyle : null]
      }
    />
  );
};

Tab.defaultProps = {
  tabStyled: null,
  titleStyled: null,
  tabStyledDisabled: null,
  titleDisabledStyled: null,
  tabStyledEnabled: {}
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
