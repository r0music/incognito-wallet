import { Text, View } from '@src/components/core';
import React from 'react';
import AppUpdater from '@components/AppUpdater/index';
import { useNavigation } from 'react-navigation-hooks';
import routeNames from '@src/router/routeNames';
import { useSelector } from 'react-redux';
import CurrencySection from '@screens/Setting/features/CurrencySection/CurrencySection';
import MainLayout from '@components/MainLayout/index';
import RemoveStorage from '@screens/Setting/features/RemoveStorage/RemoveStorage';
import ConvertCoinsSection from '@screens/Setting/features/ConvertCoinsSection';
import DeviceInfo from 'react-native-device-info';
import PINSection from './features/PINSection';
import SeparatorSection from './features/SeparatorSection';
import DevSection from './features/DevSection';
import UTXOSection from './features/UTXOSection';
import { settingStyle } from './Setting.styled';
import AddressBookSection from './features/AddressBookSection';
import { SectionItem } from './features/Section';
import { settingSelector } from './Setting.selector';
import { actionFetchServers } from './Setting.actions';
import withSetting from './Setting.enhance';
import DecimalDigitsSection from './features/DecimalDigitsSection';
import ExportCSVSection from './features/ExportCSVSection';
import RemoveBalanceCached from './features/RemoveBalanceCached';

const Setting = () => {
  const navigation = useNavigation();
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
    },
    {
      title: 'NFT Token',
      desc: 'Manage keychain\'s nft token',
      handlePress: () => navigation?.navigate(routeNames.NFTToken),
    },
  ];

  const handlePressExportCSV = () => {
    navigation?.navigate(routeNames.ExportCSV);
  };

  return (
    <MainLayout header="Settings" scrollable>
      <View>
        {sectionItemFactories.map((item, id) => (
          <SectionItem data={item} key={id} />
        ))}
        <PINSection />
        <SeparatorSection />
        <DecimalDigitsSection />
        <CurrencySection />
        <AddressBookSection />
        <ExportCSVSection handlePress={handlePressExportCSV} />
        <UTXOSection />
        <ConvertCoinsSection />
        <RemoveStorage />
        <RemoveBalanceCached />

        {global.isDebug() && <DevSection />}
      </View>
      <Text style={settingStyle.textVersion}>
        {`v${AppUpdater.appVersion}${
          global.isDebug() ? ` (${DeviceInfo.getBuildNumber()})` : ''
        }`}
      </Text>
    </MainLayout>
  );
};

export default withSetting(Setting);
