import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { TouchableOpacity } from '@src/components/core';
import { Icon } from 'react-native-elements';
import { COLORS, FONT } from '@src/styles';
import PropTypes from 'prop-types';
import TextMarquee from '@screens/MainTabBar/features/Home/AutoScrollText';

const styled = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    paddingVertical: 10,
    position: 'relative',
    paddingHorizontal: 10
  },
  text: {
    color: COLORS.white,
    fontSize: FONT.SIZE.small,
    lineHeight: FONT.SIZE.small + 3,
    fontFamily: FONT.NAME.medium,
  },
});

const BottomBar = (props) => {
  const { onPress, text, autoscroll = false } = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styled.container}>
        { autoscroll ? (
          <TextMarquee
            duration={7000}
            loop
            repeatSpacer={50}
            marqueeDelay={500}
            marqueeOnMount
            animationType="scroll"
          >
            <Text style={styled.text}>{text}</Text>
          </TextMarquee>
        ) : <Text style={styled.text}>{text}</Text>
        }
        <Icon name="chevron-right" color={COLORS.white} />
      </View>
    </TouchableOpacity>
  );
};

BottomBar.propTypes = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  autoscroll: PropTypes.bool
};

export default React.memo(BottomBar);
