import React from 'react';
import { StyleSheet } from 'react-native';
import {
    ScrollViewBorder,
    Text,
    View,
} from '@components/core';
import ConfirmHcaptcha from '@hcaptcha/react-native-hcaptcha';
import { APP_CAPTCHA_URL_SITE_KEY } from 'react-native-dotenv';
import { FONT } from '@src/styles';
import { ButtonBasic } from '@components/Button';
import { View2 } from '@components/core/View';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    content: {
        width: '100%',
        height: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: FONT.SIZE.medium,
        lineHeight: FONT.SIZE.medium + 5,
        fontFamily: FONT.NAME.medium,
    },
    centerText: {
        textAlign: 'center',
    },
    retryBtn: {
        marginTop: 20,
        width: 120
    },
});

const AccessTokenCaptcha = ({ onRefresh }) => {
    const hcaptcha = React.useRef();

    // show captcha
    const send = () => {
        if (!hcaptcha.current) return;
        hcaptcha.current.show();
    };

    const handleGenNewAccessToken = async ({ captcha }) => {
        if (typeof onRefresh === 'function') onRefresh({ captcha });
    };

    const onMessage = async (event) => {
        if (event && event.nativeEvent.data) {
            if (['cancel'].includes(event.nativeEvent.data)) {
                hcaptcha.current.hide();
                // this.setState({ code: event.nativeEvent.data});
            } else if (['error', 'expired'].includes(event.nativeEvent.data)) {
                hcaptcha.current.hide();
                // this.setState({ code: event.nativeEvent.data});
            } else {
                const captcha = event.nativeEvent.data;
                console.log('Verified code from hCaptcha', captcha);
                hcaptcha.current.hide();
                handleGenNewAccessToken({ captcha }).then();
                // await handleGenNewAccessToken({ captcha });
                // this.setState({ code: event.nativeEvent.data });
            }
        }
    };

    return (
      <View2 style={styles.container}>
        <ScrollViewBorder>
          <ConfirmHcaptcha
            ref={hcaptcha}
            siteKey={APP_CAPTCHA_URL_SITE_KEY}
            baseUrl="https://incognito.org"
            languageCode="en"
            onMessage={onMessage}
            loadingIndicatorColor='white'
            showLoading
            theme="dark"
          />
          <View style={styles.content}>
            <Text style={[styles.title, styles.centerText]}>
              {'Please enter next button \nto generate new access token...'}
            </Text>
            <ButtonBasic
              btnStyle={styles.retryBtn}
              title="Next"
              onPress={send}
            />
          </View>
        </ScrollViewBorder>
      </View2>
    );
};

AccessTokenCaptcha.propTypes = {
    onRefresh: PropTypes.func.isRequired
};

export default AccessTokenCaptcha;