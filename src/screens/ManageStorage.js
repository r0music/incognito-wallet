import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import _ from 'lodash';
import MainLayout from '@components/MainLayout';
import { Text, TouchableOpacity, RoundCornerButton, TextInput } from '@components/core';
import { THEME } from '@src/styles';
import AsyncStorage from '@react-native-community/async-storage';
import Row from '@components/Row';
import clipboard from '@services/clipboard';
import Storage from '@services/storage';
import { ExHandler } from '@services/exception';

const styles = StyleSheet.create({
  item: {
    ...THEME.text.mediumTextStyle,
    marginBottom: 20,
  },
});

const ManageStorage = () => {
  const [items, setItems] = useState([]);
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [size, setSize] = useState(20e6.toString());
  const [totalSize, setTotalSize] = useState(0);
  const [searchText, setSearchText] = useState('');
  const data = useMemo(() => {
    if (!searchText) return items;
    return items.filter(({ key }) => key.toLowerCase().includes(searchText.toLowerCase()));
  }, [searchText, items]);

  const loadItems = async () => {
    const keys = await AsyncStorage.getAllKeys();
    const newItems = [];
    let totalSize = 0;
    for (const key of keys) {
      const data = await AsyncStorage.getItem(key);
      newItems.push({
        key,
        data: data?.length,
        rawData: data,
      });
      totalSize += data?.length || 0;
    }

    setItems(_.orderBy(newItems, item => item.data, 'desc'));
    setTotalSize(totalSize);
  };

  const handleRemove = (key) => {
    AsyncStorage.removeItem(key);

    const newItems = _.remove(items, item => item.key !== key);
    setItems(newItems);
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleSpamData = async () => {
    try {
      const randomKey = 'SPAM';
      const randomData = new Array(parseInt(size)).fill('1').join('');

      let spamData = await Storage.getItem(randomKey);

      if (!spamData) {
        spamData = '';
      }

      spamData += randomData;

      await Storage.setItem(randomKey, spamData);
      await loadItems();
    } catch (e) {
      new ExHandler(e).showErrorToast();
    }
  };

  const onChangeSize = (text) => {
    setSize(text);
  };

  const formatSize = (size) => {
    if (size > 1024 * 1024) {
      return `${(size / 1024 / 1024).toFixed(2)} MB`;
    }

    if (size > 1024) {
      return `${(size / 1024 / 1024).toFixed()} KB`;
    }

    return `${(size).toFixed()} Byte`;
  };

  const addData = async () => {
    await AsyncStorage.setItem(key, value);
    await loadItems();
  };

  const onChangeKey = (text) => {
    setKey(text);
  };

  const onChangeValue = (text) => {
    setValue(text);
  };

  return (
    <MainLayout header="Manage storage" scrollable>
      <TextInput
        style={{ flex: 1, backgroundColor: 'gray' }}
        onChangeText={(text) => {
          setSearchText(text);
        }}
      />
      <Text>Size in KB</Text>
      <TextInput onChangeText={onChangeSize} defaultValue={size} />
      <RoundCornerButton title="Spam data" onPress={handleSpamData} />
      <Text>Total size: {formatSize(totalSize)}/200 MB</Text>
      {data.map(item => (
        <Row spaceBetween center style={styles.item} key={item.key}>
          <Text style={{ width: 200 }}>{item.key} ({item.data})</Text>
          <Row>
            <TouchableOpacity onPress={() => handleRemove(item.key)} style={{ marginRight: 20 }}>
              <Text>Remove</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => clipboard.set(JSON.stringify(item.rawData), { copiedMessage: `${item.key} copied.` })}>
              <Text>Copy</Text>
            </TouchableOpacity>
          </Row>
        </Row>
      ))}

      <Text>Key</Text>
      <TextInput onChangeText={onChangeKey} />
      <Text>Value</Text>
      <TextInput onChangeText={onChangeValue} />
      <RoundCornerButton title="Add data" onPress={addData} />
    </MainLayout>
  );
};

export default ManageStorage;
