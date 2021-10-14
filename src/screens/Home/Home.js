import React from 'react';
import { RefreshControl, View, StyleSheet, Linking } from 'react-native';
import PropTypes from 'prop-types';
import { ScrollView } from '@src/components/core';
import useFeatureConfig from '@src/shared/hooks/featureConfig';
import AppMaintain from '@components/AppMaintain/index';
import { useSelector } from 'react-redux';
import { isIOS } from '@src/utils/platform';
import appConstant from '@src/constants/app';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import styles from './style';
import withHome from './Home.enhance';
import Category from './features/Category';
import { homeSelector } from './Home.selector';
import DialogUpdateApp from './features/DialogUpdateApp';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const Home = (props) => {
  const [_, isDisabled, message] = useFeatureConfig(appConstant.DISABLED.APP);
  const { getHomeConfiguration, categories, isFetching } = props?.homeProps;
  const { outdatedVersion, Link: link } = useSelector(homeSelector)?.appVersion;
  const navigation = useNavigation();
  const onUpdateApp = async () => {
    try {
      const APP_STORE_LINK =
        'itms-apps://apps.apple.com/us/app/apple-store/id1475631606?mt=8';
      const PLAY_STORE_LINK = 'market://details?id=com.incognito.wallet';
      const url = isIOS() ? APP_STORE_LINK : PLAY_STORE_LINK;

      const canOpenURL = await Linking.canOpenURL(url);
      if (canOpenURL) {
        Linking.openURL(url);
      } else {
        throw new Error();
      }
    } catch (error) {
      Linking.openURL(link);
    }
  };
  //
  // React.useEffect(() => {
  //   navigation.navigate(routeNames.ShieldGenQRCode);
  // }, []);
  if (isDisabled) {
    return <AppMaintain message={message} />;
  }
  return (
    <View style={styled.container}>
      <ScrollView
        refreshControl={(
          <RefreshControl
            refreshing={isFetching}
            onRefresh={getHomeConfiguration}
          />
        )}
      >
        <View style={styles.contentContainer}>
          {categories.map((category, index) => (
            <Category
              key={category?.id}
              {...{ ...category, firstChild: index === 0 }}
            />
          ))}
        </View>
      </ScrollView>
      {/* {outdatedVersion && (
        <BottomBar
          text="Update your app to get full functionality"
          onPress={onUpdateApp}
        />
      )} */}
      {/* <DialogUpdateApp
        visible={outdatedVersion}
        onPress={onUpdateApp}
      /> */}
    </View>
  );
};

Home.propTypes = {
  homeProps: PropTypes.shape({
    getHomeConfiguration: PropTypes.func.isRequired,
    categories: PropTypes.array.isRequired,
    isFetching: PropTypes.bool.isRequired,
  }).isRequired,
};

export default withHome(Home);
