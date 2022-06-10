import React from 'react';
import MainLayout from '@components/MainLayout';
import { RoundCornerButton, Text } from '@components/core';
import { StyleSheet } from 'react-native';
import { THEME } from '@src/styles';
// import enhanceExportCSV from '@src/screens/Setting/features/ExportCSVSection/ExportCSVSection.enhance';
import enhanceExportCSV1 from '@src/screens/Setting/features/ExportCSVSection/ExportCSVSection.enhance1';
import Loading from '@screens/DexV2/components/Loading';
// import Loading from '@screens/Dex/components/Loading';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  text: {
    ...THEME.text.mediumTextMotto,
  },
  button: {
    marginTop: 50,
  },
});

const ExportCSV = (props) => {
  const { loadingExportCSV, exportCSV, forcePercent, disableBtn } = props;

  const handlePressExportCSV = () => {
    exportCSV();
  };

  return (
    <MainLayout header="CSV Export" scrollable>
      <Text style={styles.text}>
        {
          'CSV exported file will be stored locally in your device. Please grant us the permission to access your file and folder. \n\nData exported includes: trade and provide transactions, node rewards withdrawals.'
        }
      </Text>
      <RoundCornerButton
        style={styles.button}
        title="Export"
        onPress={handlePressExportCSV}
        disabled={disableBtn}
      />
      {loadingExportCSV && (
        <Loading open={loadingExportCSV} forcePercent={forcePercent} />
      )}
    </MainLayout>
  );
};

ExportCSV.propTypes = {
  loadingExportCSV: PropTypes.bool,
  forcePercent: PropTypes.number,
  exportCSV: PropTypes.func,
};

ExportCSV.defaultProps = {
  loadingExportCSV: false,
  forcePercent: 0,
  exportCSV: null,
};

export default enhanceExportCSV1(ExportCSV);
