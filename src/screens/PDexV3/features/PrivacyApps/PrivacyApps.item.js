import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text, TouchableOpacity } from '@components/core';
import PropTypes from 'prop-types';
import { ButtonTyni } from '@src/components/Button';
import { useSelector } from 'react-redux';
import { colorsSelector } from '@src/theme';
import { Row } from '@src/components';
import { FONT } from '@src/styles';
import styled from 'styled-components/native';

const styles = StyleSheet.create({
  container: {},
  header: {
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  icon: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderRadius: 25,
  },
  headerTitle: {
    ...FONT.TEXT.incognitoH5,
  },
  headerSub: {
    ...FONT.TEXT.incognitoP2,
  },
  groupActions: {
    marginVertical: 16,
    backgroundColor: 'transparent',
  },
  desc: {
    ...FONT.TEXT.incognitoP1,
  },
  headerHook: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
  },
});

const CustomTouchableOpacity = styled(TouchableOpacity)`
  background-color: ${({ theme }) => theme.background3};
  padding: 24px;
  border-radius: 10px;
`;

const PrivacyAppItem = (props) => {
  const {
    privacyAppId,
    icon,
    headerTitle,
    headerSub,
    groupActions,
    desc,
    onPressItem,
  } = props;
  const colors = useSelector(colorsSelector);
  return (
    <CustomTouchableOpacity
      style={styles.container}
      onPress={() => onPressItem(privacyAppId)}
    >
      <Row style={styles.header}>
        <View style={styles.icon}>{icon}</View>
        <View style={styles.headerHook}>
          <Text style={[styles.headerTitle]}>{headerTitle}</Text>
          <Text style={[styles.headerSub, { color: colors.subText }]}>
            {headerSub}
          </Text>
        </View>
      </Row>
      <Row style={styles.groupActions}>
        {groupActions?.map(({ id, ...rest }, index) => (
          <ButtonTyni
            key={id}
            {...rest}
            style={index !== 0 ? { marginLeft: 8 } : {}}
          />
        ))}
      </Row>
      <Text style={styles.desc}>{desc}</Text>
    </CustomTouchableOpacity>
  );
};

PrivacyAppItem.propTypes = {
  privacyAppId: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  headerTitle: PropTypes.string.isRequired,
  headerSub: PropTypes.string.isRequired,
  groupActions: PropTypes.array.isRequired,
  desc: PropTypes.string.isRequired,
  onPressItem: PropTypes.func.isRequired,
};

export default React.memo(PrivacyAppItem);
