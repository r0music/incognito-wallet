import React from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { LoadingContainer } from '@src/components/core';
import LocalDatabase from '@utils/LocalDatabase';
import AccessTokenCaptcha from '@screens/GetStarted/AccessToken/AccessToken.captcha';
import { setTokenHeader } from '@services/http';
import { getNewAccessTokenVer2 } from '@services/api/user';
import { getTokenNoCache } from '@services/auth';

const enhanceAccessToken = (WrappedComp) => (props) => {
    const [loading, setLoading] = React.useState(true);
    const [openCaptcha, setOpenCaptcha] = React.useState(false);

    const accessTokenValidator = async () => {
        try {
            const [deviceID, accessToken] = await Promise.all([
                LocalDatabase.getDeviceIDVer2(),
                LocalDatabase.getAccessTokenVer2()
            ]);
            console.log('ACCESS-TOKEN: accessTokenValidator ', { accessToken, deviceID });
            // show captcha screen, get new access token
            if (!accessToken) {
                return setOpenCaptcha(true);
            } else {
                // refresh new access-token
                setTokenHeader(accessToken);
                const { token: newAccessToken } = await getTokenNoCache();
                setTokenHeader(newAccessToken);
                setLoading(false);
            }
        } catch (e) {
            // Handle error
        }
    };

    const onRefresh = async ({ captcha }) => {
        try {
            setOpenCaptcha(false);
            const deviceID = await LocalDatabase.getDeviceIDVer2();
            const { token: accessToken } = await getNewAccessTokenVer2({ deviceID, captcha });
            if (accessToken) {
                await LocalDatabase.saveAccessTokenVer2(accessToken);
                setTokenHeader(accessToken);
                setLoading(false);
            }
        } catch (error) {
            // Handle error
            alert('CAPTCHA ERROR' + JSON.stringify(error));
        }
    };

    React.useEffect(() => {
        accessTokenValidator().then();
    }, []);

    if (openCaptcha) {
        return <AccessTokenCaptcha onRefresh={onRefresh} />;
    }

    if (loading) {
        return <LoadingContainer />;
    }


    return (
      <ErrorBoundary>
        <WrappedComp {...props} />
      </ErrorBoundary>
    );
};

export default enhanceAccessToken;
