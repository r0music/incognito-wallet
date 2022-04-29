import React, { useRef } from 'react';
import ErrorBoundary from '@src/components/ErrorBoundary';
import { useDispatch, useSelector } from 'react-redux';
import { delay } from '@src/utils/delay';
import { ExHandler } from '@src/services/exception';
import { View } from '@src/components/core';
import { ScrollView } from 'react-native';
import { ScreenWidth } from '@utils/devices';
import { actionChangeTab } from './Tabs.actions';
import { styled } from './Tabs.styled';
import { activedTabSelector } from './Tabs.selector';
import Tab from './Tabs.tab';
import Tab1 from './Tabs.tab1';

const enhance = (WrappedComp) => (props) => {
  const { children, rootTabID, useTab1 = false, defaultTabIndex = 0, borderTop = true } = props;
  const refScv = useRef(null);
  const activeTab = useSelector(activedTabSelector)(rootTabID);
  const dispatch = useDispatch();
  const listTab = children.map((chil) => chil.props.tabID);

  const onClickTabItem = async (tab) => {
    try {
      const foundTab = children.find((chil) => chil.props.tabID === tab);
      const { onChangeTab } = foundTab.props || {};
      if (activeTab !== tab) {
        dispatch(
          actionChangeTab({
            rootTabID,
            tabID: tab,
          }),
        );
        await delay(0);
        if (typeof onChangeTab === 'function') {
          onChangeTab();
        }
      }
    } catch (error) {
      new ExHandler(error).showErrorToast();
    }
  };
  const renderTabs = () => {
    return children.map((child) => {
      const { label, tabID, ...rest } = child.props;
      if (useTab1) {
        return (
          <Tab1
            activeTab={activeTab}
            key={tabID}
            label={label}
            onClickTab={onClickTabItem}
            tabID={tabID}
            {...rest}
          />
        );
      }
      return (
        <Tab
          activeTab={activeTab}
          key={tabID}
          label={label}
          onClickTab={onClickTabItem}
          tabID={tabID}
          {...rest}
        />
      );
    });
  };
  React.useEffect(() => {
    try {
      if (children) {
        let { tabID, onChangeTab } = children[defaultTabIndex]?.props;
        if (activeTab) {
          tabID = activeTab;
        }
        dispatch(
          actionChangeTab({
            rootTabID,
            tabID,
          }),
        );
        if (typeof onChangeTab === 'function') {
          onChangeTab();
        }
      }
    } catch (error) {
      console.log('ERROR HERE', error);
    }
  }, [defaultTabIndex]);
  const renderComponent = React.useCallback(() => {
    try {
      return (
        <>
          <WrappedComp {...{...props, onClickTabItem, renderTabs}} />
          <View borderTop={borderTop} style={styled.tabContent}>
            <ScrollView
              snapToInterval={ScreenWidth}
              horizontal
              ref={refScv}
              disableIntervalMomentum
              scrollEnabled={false}
              showsHorizontalScrollIndicator={false}
            >
              {children?.map((child) => {
                return (
                  <View style={{width: ScreenWidth}} key={child.props.tabID}>
                    {child.props.children}
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </>
      );
    } catch (error) {
      console.log('ERROR', error);
    }
    return null;
  }, [activeTab, refScv]);

  React.useEffect(() => {
    setTimeout(() => {
      const foundIndex = listTab.findIndex(tab => tab === activeTab);
      if (foundIndex > -1 && listTab[foundIndex] === activeTab) {
        console.log({ listTab, activeTab, foundIndex });
        refScv.current.scrollTo({
          x: foundIndex * ScreenWidth,
          animation: true
        });
      }
    }, 0);
  }, [activeTab, listTab]);

  return <ErrorBoundary>{renderComponent()}</ErrorBoundary>;
};

export default enhance;
