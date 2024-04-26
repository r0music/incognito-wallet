#!/usr/bin/env bash

echo "
PASSWORD_SECRET_KEY=$PASSWORD_SECRET_KEY
PASSPHRASE_WALLET_DEFAULT=$PASSPHRASE_WALLET_DEFAULT
API_MINER_URL=$API_MINER_URL
PASS_HOSPOT=$PASS_HOSPOT
NODE_PASSWORD=$NODE_PASSWORD
NODE_USER_NAME=$NODE_USER_NAME
" > .env

# Generate android keystore file
echo $KEYSTORE | base64 -di > android/app/wallet-app-release-key.keystore
echo $PLAY_STORE_JSON | base64 -di > play_store.json
echo $APPLE_STORE_DEVELOP_KEY | base64 -di > fastlane/develop.json
echo $APPSTORE_MOBILE_PROVISION | base64 -di > fastlane/AppStore_com.incognito.wallet.mobileprovision
echo $APPSTORE_PRIVATE_KEY | base64 -di > fastlane/appstore-private-key.p12
echo $APPSTORE_DISTRIBUTION_CERT | base64 -di > fastlane/appstore-distribution.cer
