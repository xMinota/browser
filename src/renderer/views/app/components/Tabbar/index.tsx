import { observer } from 'mobx-react';
import * as React from 'react';

import HorizontalScrollbar from '../HorizontalScrollbar';
import store from '~/renderer/views/app/store';
import { icons } from '~/renderer/views/app/constants/icons';
import { AddTab, StyledTabbar, TabsContainer } from './style';
import { Tabs } from '../Tabs';
import { NEWTAB_URL } from '../../constants';
import { ipcRenderer } from 'electron';

const getContainer = () => store.tabs.containerRef.current;

const onMouseEnter = () => (store.tabs.scrollbarVisible = true);

const onMouseLeave = () => (store.tabs.scrollbarVisible = false);

const onAddTabClick = () => {
  const url = NEWTAB_URL;
  store.tabs.addTab({ url, active: true });
};

export const Tabbar = observer(() => {
  return (
    <StyledTabbar>
      <TabsContainer
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        ref={store.tabs.containerRef}
      >
        <Tabs />
      </TabsContainer>
      <AddTab
        icon={icons.add}
        onClick={onAddTabClick}
        divRef={(r: any) => (store.addTab.ref = r)}
      />
      <HorizontalScrollbar
        ref={store.tabs.scrollbarRef}
        enabled={store.tabs.scrollable}
        visible={store.tabs.scrollbarVisible}
        getContainer={getContainer}
      />
    </StyledTabbar>
  );
});
