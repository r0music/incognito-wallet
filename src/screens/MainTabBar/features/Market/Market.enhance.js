import withFollowToken from '@screens/FollowToken/FollowToken.enhance';
import withHome from '@screens/MainTabBar/features/Home/Home.enhance';
import ErrorBoundary from '@src/components/ErrorBoundary';
import React from 'react';
import { compose } from 'recompose';
import BottomBarLearnMore from '@components/core/BottomBar/BottomBar_LearnMore';

const withMarket = (WrappedComp) => (props) => {
  const [filter, setFilter] = React.useState({
    filterField: 'change',
    orderField: 'desc',
  });
  return (
    <ErrorBoundary>
      <WrappedComp
        {...{
          ...props,
          ...filter,
          onFilter: setFilter,
        }}
      />
      <BottomBarLearnMore
        onPress={() => {}}
        text="Sunsetting Incognito."
        autoscroll
      />
    </ErrorBoundary>
  );
};

export default compose(withHome, withMarket, withFollowToken);
