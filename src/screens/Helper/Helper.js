import React, {memo} from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { Header } from '@src/components';
import { COLORS, FONT } from '@src/styles';
import PropTypes from 'prop-types';
import { v4 } from 'uuid';
import withEnhance from './Helper.enhance';

const HelperScreen = ({ title, contents, style }) => {

  const renderContent = () => {
    let views = [];
    contents.forEach(section => {
      const content = section?.content || '';
      const subTitle = section?.subTitle || '';
      const key = v4();
      views.push(
        <View key={key}>
          { !!subTitle && (
            <Text style={styles.subTitle}>
              {subTitle}
            </Text>
          )}
          <Text style={styles.content}>
            {content}
          </Text>
        </View>
      );
    });
    return views;
  };

  return (
    <View style={styles.container}>
      <Header title={title} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.wrapper, style]}>
          {renderContent()}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  wrapper: {
    flex: 1,
    paddingTop: 43,
    marginBottom: 40
  },
  subTitle: {
    ...FONT.STYLE.bold,
    marginTop: 25,
    lineHeight: 25,
    marginBottom: 5,
    color: COLORS.black,
    fontSize: FONT.SIZE.medium
  },
  content: {
    ...FONT.STYLE.medium,
    lineHeight: 25,
    color: COLORS.newGrey,
    fontSize: FONT.SIZE.regular
  }
});

HelperScreen.defaultProps = {
  style: null,
};
HelperScreen.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.array.isRequired,
  style: PropTypes.object
};

export default withEnhance(memo(HelperScreen));
