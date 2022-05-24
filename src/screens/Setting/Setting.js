import { Text, View, ScrollViewBorder } from '@src/components/core';
import React from 'react';
import AppUpdater from '@components/AppUpdater/index';
import { useNavigation, useNavigationParam } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { useSelector } from 'react-redux';
import RemoveStorage from '@screens/Setting/features/RemoveStorage/RemoveStorage';
import ConvertCoinsSection from '@screens/Setting/features/ConvertCoinsSection';
import DeviceInfo from 'react-native-device-info';
import { NetworkIcon, SecurityIcon } from '@components/Icons';
import { Header } from '@src/components';
import HideBalance from '@screens/Setting/features/HideBalance';
import { compose } from 'recompose';
import { withLayout_2 } from '@components/Layout';
import RemoveOldPool from '@screens/Setting/features/RemoveOldPool';
import PINSection from './features/PINSection';
import SeparatorSection from './features/SeparatorSection';
import DevSection from './features/DevSection';
import { settingStyle } from './Setting.styled';
import AddressBookSection from './features/AddressBookSection';
import { SectionItem } from './features/Section';
import { settingSelector } from './Setting.selector';
import { actionFetchServers } from './Setting.actions';
import withSetting from './Setting.enhance';
import DecimalDigitsSection from './features/DecimalDigitsSection';
import RemoveBalanceCached from './features/RemoveBalanceCached';

const Setting = () => {
  const navigation = useNavigation();
  const showHeader = useNavigationParam('showHeader');
  const { server } = useSelector(settingSelector);
  const sectionItemFactories = [
    {
      title: 'Network',
      desc: `${server?.name || 'Change default server'}`,
      subDesc: `${server?.address || '---'}`,
      handlePress: () =>
        navigation?.navigate(routeNames.NetworkSetting, {
          onReloadedNetworks: actionFetchServers,
        }),
      icon: <NetworkIcon />,
      nonPaddingTop: true,
    },
    {
      title: 'Tickets',
      desc: 'View and mint tickets',
      handlePress: () => navigation?.navigate(routeNames.NFTToken),
      icon: <SecurityIcon />,
    },
  ];

  return (
    <>
      {!!showHeader && <Header title="Settings" />}
      <ScrollViewBorder
        style={{ paddingHorizontal: 0 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={settingStyle.container}>
          {sectionItemFactories.map((item, index) => (
            <SectionItem
              data={item}
              key={`${item.title} ${item.desc}`}
              firstItem={index === 0}
            />
          ))}
          {/* <PayFeeByPRV /> */}
          <PINSection />
          <SeparatorSection />
          <DecimalDigitsSection />
          {/*<CurrencySection />*/}
          <AddressBookSection />
          {/* <ExportCSVSection handlePress={handlePressExportCSV} /> */}
          {/* <UTXOSection /> */}
          <ConvertCoinsSection />
          <RemoveStorage />
          <RemoveBalanceCached />
          <HideBalance />
          <RemoveOldPool />
          {global.isDebug() && <DevSection />}
        </View>
        <View>
          <Text style={[settingStyle.textVersion]}>
            {`v${AppUpdater.appVersion}${
              global.isDebug() ? ` (${DeviceInfo.getBuildNumber()})` : ''
            }`}
          </Text>
        </View>
      </ScrollViewBorder>
    </>
  );
};

export default compose(withLayout_2, withSetting)(Setting);
