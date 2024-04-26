import React from 'react';
import { RefreshControl, View, StyleSheet, Linking } from 'react-native';
import PropTypes from 'prop-types';
import { ScrollView } from '@src/components/core';
import useFeatureConfig from '@src/shared/hooks/featureConfig';
import AppMaintain from '@components/AppMaintain/index';
import appConstant from '@src/constants/app';
import BottomBarLearnMore from '@components/core/BottomBar/BottomBar_LearnMore';
import styles from './style';
import withHome from './Home.enhance';
import Category from './features/Category';

export const styled = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const Home = (props) => {
  const [_, isDisabled, message] = useFeatureConfig(appConstant.DISABLED.APP);
  const { getHomeConfiguration, categories, isFetching } = props?.homeProps;
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
      <BottomBarLearnMore
        onPress={() => {}}
        text="Sunsetting Incognito."
        autoscroll
      />
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
