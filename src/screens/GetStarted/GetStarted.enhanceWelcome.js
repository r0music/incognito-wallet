import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { LoadingContainer } from '@src/components/core';
import Welcome from '@screens/GetStarted/Welcome';
import { initialMasterKeySelector } from '@src/redux/selectors/masterKey';
import { actionLoadInitial } from '@src/redux/actions/masterKey';

import { useDispatch, useSelector } from 'react-redux';
import Tutorial from '@screens/Turotial/Tutorial';
import { newUserTutorialSelector } from '@src/redux/selectors/settings';
import { getVideoTutorial } from '@src/redux/actions/settings';

const enhance = (WrappedComp) => (props) => {
  const { loading, masterKeyList } = useSelector(initialMasterKeySelector);
  const dispatch = useDispatch();
  const newUser = useSelector(newUserTutorialSelector);

  const handleFetchData = () => dispatch(actionLoadInitial());
  const handleFetchTutorial = () => dispatch(getVideoTutorial());
  React.useEffect(() => {
    handleFetchTutorial();
    handleFetchData();
  }, []);

  if (loading) {
    return <LoadingContainer />;
  }

  if (masterKeyList.length === 0 || !masterKeyList) {
    return <Welcome />;
  }

  if (newUser) {
    return <Tutorial />;
  }

  return (
    <ErrorBoundary>
      <WrappedComp {...props} />
    </ErrorBoundary>
  );
};

export default enhance;
