import React from 'react';
import Header from '@src/components/Header';
import { useNavigationParam } from 'react-navigation-hooks';
import { DropdownMenu, ScrollViewBorder, KeyboardAwareScrollView, View } from '@src/components/core';
import { View2 } from '@src/components/core/View';
import PropTypes from 'prop-types';
import withListAllReceivers from './FrequentReceivers.enhance';
import Item from './FrequentReceivers.item';
import { styledModal as styled } from './FrequentReceivers.styled';

const ListReceivers = (props) => {
  const { receivers } = props;
  const onSelectedItem = useNavigationParam('onSelectedItem');
  const disabledSwipe = useNavigationParam('disabledSwipe');
  const onSelectedAddress = async (receiver = { name: '', address: '' }) => {
    if (typeof onSelectedItem === 'function') {
      return onSelectedItem(receiver);
    }
  };
  return (
    <View>
      {receivers?.map((receiver, index) => (
        <DropdownMenu
          defaultToggle={index === 0}
          sections={[receiver]}
          renderItem={({ item }) => {
            return (
              <Item
                {...{
                  ...item,
                  disabledSwipe,
                  keySave: receiver?.keySave,
                  onPress: () =>
                    onSelectedAddress({ ...item, keySave: receiver?.keySave }),
                }}
              />
            );
          }}
          key={index}
          customStyle={[
            { marginBottom: 30 },
          ]}
        />
      ))}
    </View>
  );
};

const ListAllReceivers = (props) => {
  const { receivers, isEmpty } = props;
  return (
    <View2 fullFlex>
      <Header
        title="Search by name or address"
        style={styled.header}
        canSearch
      />
      <ScrollViewBorder>
        <View fullFlex>
          <ListReceivers {...{ receivers, isEmpty }} />
        </View>
      </ScrollViewBorder>
    </View2>
  );
};

ListReceivers.propTypes = {
  receivers: PropTypes.array.isRequired,
  isEmpty: PropTypes.bool.isRequired,
};

ListAllReceivers.propTypes = {
  receivers: PropTypes.array.isRequired,
  isEmpty: PropTypes.bool.isRequired,
  Wrapper: PropTypes.any.isRequired,
};

export default withListAllReceivers(ListAllReceivers);
