import React from 'react';
import { InteractionManager } from 'react-native';
import { LoadingContainer } from '@src/components';

const withLazy = (WrappedComp) => (props) => {
  const { shouldLazy = true, emptyView } = props;
  if (!shouldLazy) {
    return (
      <WrappedComp
        {...{
          ...props,
        }}
      />
    );
  }
  const [hidden, setHidden] = React.useState(true);
  const emptyViewComp = React.useMemo(
    () => emptyView || <LoadingContainer />,
    [],
  );
  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setTimeout(() => {
        setHidden(false);
      }, 0);
    });
  }, []);
  if (hidden) return emptyViewComp;
  return (
    <WrappedComp
      {...{
        ...props,
      }}
    />
  );
};

export default withLazy;
