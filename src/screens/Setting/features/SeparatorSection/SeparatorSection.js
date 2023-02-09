import React from 'react';
// import { Switch, View } from '@components/core';
// import { Text5 } from '@src/components/core/Text';
// import {
//   getDecimalSeparator,
// } from '@src/resources/separator';
// import Section, { sectionStyle } from '@screens/Setting/features/Section';
// import { SeparatorIcon } from '@components/Icons';

const SeparatorSection = () => {
  // const [decimalSeparator, setDecimalSeparator] = useState(
  //   getDecimalSeparator(),
  // );

  // const toggleDecimal = () => {
  //   if (decimalSeparator === '.') {
  //     setDecimalSeparator(',');
  //     saveDecimalSeparator(',');
  //   } else {
  //     setDecimalSeparator('.');
  //     saveDecimalSeparator('.');
  //   }
  //   RNRestart.Restart();
  // };

  // return (
  //   <Section
  //     label="Decimal Separator"
  //     headerRight={
  //       <Switch onValueChange={toggleDecimal} value={decimalSeparator === ','} />
  //     }
  //     headerIcon={<SeparatorIcon />}
  //     customItems={[
  //       <View
  //         key="separator"
  //         onPress={toggleDecimal}
  //         style={[sectionStyle.subItem]}
  //       >
  //         <Text5 style={[sectionStyle.desc]}>
  //           {'Use decimal comma\ninstead of point'}
  //         </Text5>
  //       </View>,
  //     ]}
  //   />
  // );

  return null;
};

export default React.memo(SeparatorSection);
