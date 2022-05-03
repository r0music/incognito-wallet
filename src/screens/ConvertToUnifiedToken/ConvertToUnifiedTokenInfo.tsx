import { View } from '@src/components/core';
import Header from '@src/components/Header';
import { withLayout_2 } from '@src/components/Layout';
import React from 'react';

const ConvertToUnifiedTokenInfo: React.FC = () => {
  return (
    <>
      <Header
        title="Convert coins info"
      />
      <View borderTop fullFlex />
    </>
  );
};

export default withLayout_2(ConvertToUnifiedTokenInfo);
