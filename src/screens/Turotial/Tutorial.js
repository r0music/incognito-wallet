import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import MainLayout from '@components/MainLayout';
import globalStyled from '@src/theme/theme.styled';
import YoutubePlayer from 'react-native-youtube-iframe';
import { ScreenHeight, ScreenWidth } from '@utils/devices';
import { useDispatch, useSelector } from 'react-redux';
import { newUserTutorialSelector, videosSelector } from '@src/redux/selectors/settings';
import { Text8 } from '@components/core/Text';
import { LoadingContainer, ScrollView, Text3 } from '@components/core';
import { FONT } from '@src/styles';
import PropTypes from 'prop-types';
import { setNewUserTutorial } from '@src/redux/actions/settings';
import { useNavigation } from 'react-navigation-hooks/src/Hooks';
import routeNames from '@routers/routeNames';
import { Header } from '@src/components';
import { View2 } from '@components/core/View';

const styles = StyleSheet.create({
  webview: {
    borderRadius: 10,
    overflow: 'hidden',
    // width: ScreenWidth - 24 * 2,
    alignSelf: 'center',
    backgroundColor: 'transparent'
  },
  title: {
    ...FONT.TEXT.incognitoH6,
    lineHeight: 27,
    marginTop: 15
  },
  sub: {
    ...FONT.TEXT.incognitoP2,
    lineHeight: 21,
  },
  wrapContent: {
    marginBottom: 20,
  },
  loading: {
    height: 40,
    position: 'absolute',
    alignSelf: 'center'
  },
  wrapper: {
    marginBottom: 21,
    borderRadius: 10,
  }
});
const VIDEO_HEIGHT = Math.floor((ScreenWidth - 24 * 2) / 16 * 9);

const Video = React.memo((props) => {
  const { title, sub, video: videoID, onPressExpand, index, displayIndex } = props;
  const [playing, setPlaying] = React.useState(false);
  const [loading, setLoading] = React.useState(displayIndex === index);
  const [fullScreen, setFullScreen] = React.useState(false);

  const onStateChange = React.useCallback((state) => {
    if (state === 'ended') {
      setPlaying(false);
    }
  }, []);

  const onExpandVideo = React.useCallback(() => {
    if (typeof onPressExpand === 'function') {
      onPressExpand(index);
    }
  }, [onPressExpand, index]);

  const onLoadVideo = React.useCallback(() => {
    setLoading(false);
  }, []);

  const onFullScreenChange = (fullscreenStatus) => {
    console.log('fullscreenStatus::: ', fullscreenStatus);
    setFullScreen(fullscreenStatus);
  };

  React.useEffect(() => {
    if (index === displayIndex) setLoading(true);
  }, [index, displayIndex]);

  return (
    <View>
      <TouchableOpacity style={[styles.wrapContent, globalStyled.defaultPaddingHorizontal]} onPress={onExpandVideo}>
        <Text8 style={styles.title}>{title}</Text8>
        <Text3 style={styles.sub}>{sub}</Text3>
      </TouchableOpacity>
      {displayIndex === index && (
        <View style={styles.wrapper}>
          <>
            {loading && (
              <LoadingContainer containerStyled={styles.loading} />
            )}
            <YoutubePlayer
              height={VIDEO_HEIGHT}
              play={playing}
              videoId={videoID}
              webViewStyle={[styles.webview, { width: fullScreen ? ScreenWidth : (ScreenWidth - 24 *2) }]}
              onChangeState={onStateChange}
              webViewProps={{ allowsFullscreenVideo: true }}
              onReady={onLoadVideo}
              javaScriptEnabled
              scrollEnabled={false}
              onFullScreenChange={onFullScreenChange}
            />
          </>
        </View>
      )}
    </View>
  );
});

const TutorialList = () => {
  const dispatch = useDispatch();
  const videos = useSelector(videosSelector);
  const isNewUser = useSelector(newUserTutorialSelector);
  const navigation = useNavigation();
  const [displayIndex, setDisplayIndex] = React.useState(0);

  const onPressExpand = (index) => setDisplayIndex(index);

  const renderVideo = React.useCallback((item, index) =>
    <Video key={item.video} {...item} index={index} displayIndex={displayIndex} onPressExpand={onPressExpand} />
    , [displayIndex, onPressExpand]);

  const onGoBack = () => {
    if (!isNewUser) {
      navigation.goBack();
    } else {
      dispatch(setNewUserTutorial(false));
      navigation.navigate(routeNames.GetStarted);
    }
  };

  return (
    <View2 fullFlex>
      <Header title="Tutorial" onGoBack={onGoBack} />
      <ScrollView style={[globalStyled.defaultBorderSection, { paddingHorizontal: 0 }]}>
        {(videos || []).map(renderVideo)}
      </ScrollView>
    </View2>
  );
};

Video.propTypes = {
  title: PropTypes.string.isRequired,
  sub: PropTypes.string.isRequired,
  video: PropTypes.string.isRequired,
  onPressExpand: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  displayIndex: PropTypes.number.isRequired
};

export default TutorialList;
