import AsyncStorage from '@react-native-community/async-storage';

const LARGE_KEY = 'LARGEDATA';
const SIZE = 2e6;

const Storage = {
  async handleSaveLargeData(key, value) {
    try {
      // Save new data
      const parts = value.match(/.{1,2000000}/g);
      const objectKey = { type: LARGE_KEY, noOfParts: parts.length };
      for (let i = 0; i < parts.length; i++) {
        const dataItem = parts[i];
        const keyItem = `${key}-part${i}`;
        await AsyncStorage.setItem(keyItem, dataItem);
      }

      const data = JSON.stringify(objectKey);
      await AsyncStorage.setItem(key, data);

      // Multiset cause crash when saving large data (40MB) on Android
      // await AsyncStorage.multiSet(savedData);
    } catch (error) {
      console.log('error', error);
      throw error;
    }
  },

  async handleLoadLargeData(key, objectKey) {
    try {
      let data = '';
      for (let i = 0; i < objectKey.noOfParts; i++) {
        const keyItem = `${key}-part${i}`;
        const dataItem = await AsyncStorage.getItem(keyItem);
        data = `${data}${dataItem}`;
      }

      // Multiget cause crash when loading large data (40MB) on Android
      // const dataArray = await AsyncStorage.multiGet(keyItems);
      // return dataArray.map(items => items[1]).join('');
      return data;
    } catch (error) {
      // throw error;
      console.debug('LOAD LARGE DATA ERROR', error);
      return '';
    }
  },

  setItem(key: string, value: string, callback: function) {
    // console.debug('SET ITEM', key);
    return new Promise(async (resolve, reject) => {
      // If data is larger than 2mb we need to throw error
      // Because Android can not store a key larger than 2MB
      if (value && value.length > SIZE) {
        // const message = 'Your masterless\'s histories is so large. Please go to the settings to delete the histories.';
        // Toast.showError(`${message} (${key}-${(value.length / 1e6).toFixed(2)}MB)`);
        try {
          await this.handleSaveLargeData(key, value);
          return resolve();
        } catch (error) {
          return reject(error);
        }
      }

      AsyncStorage.setItem(key, value, (err) => {
        if (typeof callback === 'function') {
          callback(err);
        }
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  },
  getItem(key: string, callback: function) {
    // console.debug('GET ITEM', key);
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(key, async (err, rs) => {
        if (typeof callback === 'function') {
          callback(err, rs);
        }
        if (err) {
          return reject(err);
        }
        try {
          const parseData = JSON.parse(rs);
          if (parseData && parseData.type === LARGE_KEY) {
            try {
              const result = await this.handleLoadLargeData(key, parseData);
              return resolve(result);
            } catch (error) {
              reject(error);
            }
          }
          resolve(rs);
        } catch (error) {
          resolve(rs);
        }
      });
    });
  },
  removeItem(key: string, callback: function) {
    console.debug('REMOVE ITEM', key);
    return new Promise((resolve, reject) => {
      AsyncStorage.removeItem(key, (err) => {
        if (typeof callback === 'function') {
          callback(err);
        }
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  },
  clear(callback: function) {
    return new Promise((resolve, reject) => {
      AsyncStorage.clear((err) => {
        if (typeof callback === 'function') {
          callback(err);
        }
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  },
};

export default Storage;
