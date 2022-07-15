import React from 'react';
import PropTypes from 'prop-types';
import { FlexView, Image, Text } from '@src/components/core';
import appMaintainImg from '@src/assets/images/app-maintain.png';
import styles from './styles';

const AppMaintain = ({ message }) => {
  return (
    <FlexView style={[styles.center, styles.container]}>
      <Image source={appMaintainImg} style={styles.image} />
      <Text style={styles.title}>Upgrade in progress</Text>
      <Text style={styles.message}>{message}</Text>
    </FlexView>
  );
};

AppMaintain.propTypes = {
  message: PropTypes.string,
};

AppMaintain.defaultProps = {
  message: '',
};

export default AppMaintain;
