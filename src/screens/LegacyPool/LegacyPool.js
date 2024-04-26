import { withLayout_2 } from '@components/Layout';
import { Header } from '@src/components';
import {
  ScrollViewBorder,
  View,
  Text,
  TouchableOpacity,
} from '@src/components/core';
import GroupSubInfo from '@src/screens/PDexV3/features/OrderLimit/OrderLimit.groupSubInfo';
import React from 'react';
import { compose } from 'recompose';
import { actionSetPoolSelected } from '@screens/PDexV3/features/OrderLimit';
import { useDispatch } from 'react-redux';
import { useNavigation } from 'react-navigation-hooks';
import { actionGetPDexV3Inst } from '@src/screens/PDexV3';
import { RatioIcon } from '@components/Icons';
import withLegacy, { NEW_POOL, ListPool } from './LegacyPool.enhance';
import styles from './LegacyPool.styled';
// eslint-disable-next-line import/no-cycle

const LegacyPool = (props) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { currentPool, onChangePool } = props;

  const setDeafultPool = async () => {
    const pDexV3Inst = await dispatch(actionGetPDexV3Inst());
    dispatch(actionSetPoolSelected(NEW_POOL));
    pDexV3Inst.setDefaultPool(NEW_POOL);
  };

  return (
    <>
      <Header
        title="Cancel Order"
        onGoBack={() => {
          navigation.goBack();
          setDeafultPool();
        }}
      />
      <ScrollViewBorder
        style={{ paddingHorizontal: 0 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <Text style={styles.description}>
            Cancel your Buy/Sell orders on the deprecated PRV/USDT pool.
          </Text>
          <View style={styles.groupRadio}>
            {ListPool.map((item) => {
              return (
                <TouchableOpacity
                  style={styles.rowRadio}
                  key={`${item.title}`}
                  onPress={() => onChangePool(item)}
                >
                  <RatioIcon
                    selected={item.type === currentPool.type}
                    style={styles.radioStyle}
                  />
                  <Text
                    style={[
                      styles.description,
                      {
                        marginLeft: 10,
                        fontSize: 15,
                      },
                    ]}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <GroupSubInfo
            styleContainer={{
              flex: 1,
              padding: 0,
              marginTop: 0,
            }}
          />
        </View>
      </ScrollViewBorder>
    </>
  );
};

export default compose(withLayout_2, withLegacy)(LegacyPool);
