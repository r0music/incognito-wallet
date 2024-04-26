import TextMarquee from '@screens/MainTabBar/features/Home/AutoScrollText';
import { TouchableOpacity } from '@src/components/core';
import { COLORS, FONT } from '@src/styles';
import PropTypes from 'prop-types';
import React from 'react';
import { StyleSheet, Text, View ,Linking} from 'react-native';
import { Icon } from 'react-native-elements';


const styled = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    position: 'relative',
  },
  text: {
    color: COLORS.white,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 3,
    fontFamily: FONT.NAME.medium,
    marginRight: 8,
  },
  text1: {
    color: COLORS.lightOrange,
    textDecorationStyle:'solid',
    textDecorationLine: 'underline',
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 3,
    fontFamily: FONT.NAME.medium,
  },
});

const BottomBarLearnMore = (props) => {
  const { onPress, text, autoscroll = false } = props;
  return (
    <TouchableOpacity  onPress={() => {
      Linking.openURL('https://we.incognito.org/t/sunsetting-incognito/22563');
    }}
    >
      <View style={styled.container}>
        <Text style={styled.text}>{text}</Text>
        <Text
          style={styled.text1}
         
        >Read more
        </Text>
        <Icon name="chevron-right" color={COLORS.white} />
      </View>
    </TouchableOpacity>
  );
};

BottomBarLearnMore.propTypes = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  autoscroll: PropTypes.bool
};

export default React.memo(BottomBarLearnMore);
