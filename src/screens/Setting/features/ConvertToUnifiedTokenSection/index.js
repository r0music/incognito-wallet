import React from 'react';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@routers/routeNames';
import { SectionItem as Section } from '@screens/Setting/features/Section';
import {ConvertIcon} from '@components/Icons';


const ConvertToUnifiedTokenSection = React.memo(() => {
  const navigation = useNavigation();
  const handleGoConvert = () => {
    navigation.navigate(routeNames.ConvertToUnifiedToken);
  };

  return (
    <Section
      data={{
        title: 'Unify coins',
        desc: 'Unify coins for each keychain',
        handlePress: handleGoConvert,
        icon: <ConvertIcon />,
      }}
    />
  );
});

ConvertToUnifiedTokenSection.propTypes = {};

export default ConvertToUnifiedTokenSection;
