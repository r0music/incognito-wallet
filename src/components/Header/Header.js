import React from 'react';
import { BackHandler, SafeAreaView } from 'react-native';
import { BtnCircleBack } from '@src/components/Button';
import PropTypes from 'prop-types';
import { useFocusEffect, useNavigation } from 'react-navigation-hooks';
import debounce from 'lodash/debounce';
import { TouchableOpacity, Text } from '@src/components/core';
import { View2 } from '@src/components/core/View';
import SelectAccountButton from '@src/components/SelectAccountButton';
import { SearchIcon } from '@src/components/Icons';
import { styled, styledHeaderTitle } from './Header.styled';
import SearchBox from './Header.searchBox';
import withHeader from './Header.enhance';

export const HeaderContext = React.createContext({});

export const HeaderTitle = () => {
  const { headerProps } = React.useContext(HeaderContext);
  const {
    onHandleSearch,
    title,
    titleStyled,
    canSearch,
    customHeaderTitle,
    styledContainerHeaderTitle,
  } = headerProps;
  const Title = () => (
    <View2 style={[styledHeaderTitle.container]}>
      <View2
        style={[styledHeaderTitle.containerTitle, styledContainerHeaderTitle]}
      >
        <Text
          style={[
            styledHeaderTitle.title,
            canSearch && styledHeaderTitle.searchStyled,
            titleStyled,
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View2>

      {customHeaderTitle && customHeaderTitle}
    </View2>
  );
  if (!canSearch) {
    return <Title />;
  }
  return (
    <TouchableOpacity
      style={styledHeaderTitle.container}
      onPress={onHandleSearch}
    >
      <Title />
      <SearchIcon />
    </TouchableOpacity>
  );
};
const Header = ({
  title,
  rightHeader,
  titleStyled,
  canSearch,
  dataSearch,
  toggleSearch,
  autoFocus,
  accountSelectable,
  onGoBack,
  onHandleSearch,
  style,
  onSubmit,
  isNormalSearch,
  onTextSearchChange,
  customHeaderTitle,
  styledContainerHeaderTitle,
  placeHolder,
  ignoredAccounts,
  hideBackButton,
  disableAccountButton,
  handleSelectedAccount,
}) => {
  const { goBack } = useNavigation();
  const handleGoBack = () =>
    typeof onGoBack === 'function' ? onGoBack() : goBack();
  const _handleGoBack = debounce(handleGoBack, 100);

  useFocusEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        _handleGoBack();
        return true;
      },
    );
    return () => backHandler.remove();
  });

  const renderHeaderTitle = () => {
    if (toggleSearch || autoFocus) {
      console.log('000000 ');
      if (isNormalSearch) {
        console.log('1111111');
        return (
          <SearchBox
            placeHolder={placeHolder || ''}
            onSubmit={isNormalSearch ? onSubmit : () => {}}
            onChange={(text) =>
              isNormalSearch ? onTextSearchChange(text) : () => {}
            }
            isNormalSearch={isNormalSearch}
          />
        );
      }
      console.log('222222');
      return <SearchBox title={title} inputStyle={titleStyled} />;
    }
    console.log('33333');
    return <HeaderTitle />;
  };
  return (
    <HeaderContext.Provider
      value={{
        headerProps: {
          title,
          rightHeader,
          titleStyled,
          canSearch,
          dataSearch,
          toggleSearch,
          onHandleSearch,
          customHeaderTitle,
          styledContainerHeaderTitle,
        },
      }}
    >
      <SafeAreaView>
        <View2 style={[styled.container, style]}>
          {!hideBackButton && <BtnCircleBack onPress={_handleGoBack} />}
          {renderHeaderTitle()}
          {!!rightHeader && rightHeader}
          {accountSelectable && (
            <View2>
              <SelectAccountButton
                disabled={disableAccountButton}
                ignoredAccounts={ignoredAccounts}
                handleSelectedAccount={handleSelectedAccount}
              />
            </View2>
          )}
        </View2>
      </SafeAreaView>
    </HeaderContext.Provider>
  );
};

Header.defaultProps = {
  rightHeader: null,
  titleStyled: null,
  canSearch: false,
  dataSearch: [],
  accountSelectable: false,
  onGoBack: null,
  style: null,
  onSubmit: () => {},
  onTextSearchChange: () => {},
  isNormalSearch: false,
  customHeaderTitle: null,
  styledContainerHeaderTitle: null,
  placeHolder: '',
  ignoredAccounts: [],
  hideBackButton: false,
  disableAccountButton: false,
  handleSelectedAccount: null,
  autoFocus: false,
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  rightHeader: PropTypes.element,
  titleStyled: PropTypes.any,
  canSearch: PropTypes.bool,
  dataSearch: PropTypes.array,
  toggleSearch: PropTypes.bool.isRequired,
  accountSelectable: PropTypes.bool,
  onGoBack: PropTypes.func,
  onHandleSearch: PropTypes.func.isRequired,
  style: PropTypes.any,
  onSubmit: PropTypes.func,
  onTextSearchChange: PropTypes.func,
  isNormalSearch: PropTypes.bool,
  customHeaderTitle: PropTypes.element,
  styledContainerHeaderTitle: PropTypes.any,
  placeHolder: PropTypes.string,
  ignoredAccounts: PropTypes.array,
  hideBackButton: PropTypes.bool,
  disableAccountButton: PropTypes.bool,
  handleSelectedAccount: PropTypes.func,
  autoFocus: PropTypes.bool,
};

export default withHeader(React.memo(Header));
