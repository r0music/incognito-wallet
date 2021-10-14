import React, { memo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { COLORS, FONT } from '@src/styles';
import { useKeyboard } from '@src/components/UseEffect/useKeyboard';
import debounce from 'lodash/debounce';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 0,
    height: '50%',
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '100%',
  },
  safeScreen: {
    flex: 1,
  },
  title: {
    ...FONT.STYLE.medium,
    fontSize: FONT.SIZE.superMedium,
    lineHeight: FONT.SIZE.superMedium + 10,
    color: COLORS.black,
    marginBottom: 22,
  },
});

const ModalBottomSheet = ({
  title,
  headerView,
  contentView,
  customContent,
  style,
}) => {
  const [stylesheet, setStyle] = React.useState({});
  const [isKeyboardVisible] = useKeyboard();
  const debounceHandleEnhanceHeight = debounce(
    React.useCallback(() => setStyle({ height: '80%' }), []),
    100,
  );
  React.useEffect(() => {
    if (isKeyboardVisible) {
      debounceHandleEnhanceHeight();
    } else {
      setStyle({});
    }
  }, [isKeyboardVisible]);
  return (
    <View
      style={{
        ...styles.container,
        ...stylesheet,
        ...style,
      }}
    >
      <SafeAreaView style={styles.safeScreen}>
        {customContent ? (
          customContent
        ) : (
          <>
            {!!title && <Text style={styles.title}>{title}</Text>}
            {!!headerView && headerView}
            {!!contentView && <ScrollView>{contentView}</ScrollView>}
          </>
        )}
      </SafeAreaView>
    </View>
  );
};

ModalBottomSheet.defaultProps = {
  title: undefined,
  customContent: undefined,
  headerView: undefined,
  contentView: undefined,
  style: {},
};

ModalBottomSheet.propTypes = {
  title: PropTypes.string,
  customContent: PropTypes.any,
  headerView: PropTypes.any,
  contentView: PropTypes.any,
  style: PropTypes.any,
};

export default memo(ModalBottomSheet);
