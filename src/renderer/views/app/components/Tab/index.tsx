import { observer } from 'mobx-react';
import * as React from 'react';

import { Preloader } from '../../../../components/Preloader';
import { Tab } from '../../models/tab';
import store from '../../store';
import {
  StyledTab,
  StyledContent,
  StyledIcon,
  StyledTitle,
  StyledClose,
  StyledBorder,
  TabContainer,
  StyledOverlay,
} from './style';
import { shadeBlendConvert } from '../../utils';
import { remote, ipcRenderer } from 'electron';
import Ripple from '../../../../components/Ripple';
import { colors } from '../../../../constants';
import { NEWTAB_URL } from '../../constants';
import { getTabMenu } from '~/main/menus/tab';

const removeTab = (tab: Tab) => () => {
  tab.close();
};

const onCloseMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
  e.stopPropagation();
};

const onMouseDown = (tab: Tab) => (e: React.MouseEvent<HTMLDivElement>) => {
  if (tab.isUrlVisible == false) {
    const { pageX } = e;

    tab.select();

    store.tabs.lastMouseX = 0;
    store.tabs.isDragging = true;
    store.tabs.mouseStartX = pageX;
    store.tabs.tabStartX = tab.left;

    store.tabs.lastScrollLeft = store.tabs.containerRef.current.scrollLeft;

    if (e.button == 1) {
      tab.close();
    }
  }
};

const onMouseEnter = (tab: Tab) => () => {
  if (!store.tabs.isDragging) {
    store.tabs.hoveredTabId = tab.id;
  }
};

const onMouseLeave = () => {
  store.tabs.hoveredTabId = -1;
};

const onClick = (tab: Tab) => (e: React.MouseEvent<HTMLDivElement>) => {
  if(store.canToggleMenu) {
    store.canToggleMenu = false;
    ipcRenderer.send('open-search');
  }
}

const contextMenu = (tab: Tab) => () => {
  const { tabs } = store.tabGroups.currentGroup;

  const menu = getTabMenu(tab, tabs)

  menu.popup();
};

const Content = observer(({ tab }: { tab: Tab }) => {
  return (
    <StyledContent collapsed={tab.isExpanded} background={tab.isSelected ? store.theme['primary'] : store.theme['tab-inactive-color']}>
      {!tab.loading && tab.favicon !== '' && (
        <StyledIcon
          isIconSet={tab.favicon == undefined}
          style={{ backgroundImage: `url(${tab.favicon == undefined ? '' : tab.favicon})` }}
        ></StyledIcon>
      )}

      {tab.loading && (
        <Preloader
          color={
            store.preferences.conf.appearance.theme == "light" 
              ? tab.background 
              : shadeBlendConvert(
                  0.8,
                  tab.background,
                )
          }
          thickness={6}
          size={16}
          style={{ minWidth: 16 }}
        />
      )}
      <StyledTitle
        isIcon={tab.loading ? true : tab.favicon !== ''}
        tab={tab}
        style={{ 
          color: store.theme["tab-text-color"]
        }}
      >
        <span>{tab.title}</span>
      </StyledTitle>
    </StyledContent>
  );
});

const Close = observer(({ tab }: { tab: Tab }) => {
  return (
    <StyledClose
      onMouseDown={onCloseMouseDown}
      onClick={removeTab(tab)}
      title={store.locale.lang.window[0].navigate_close}
    />
  );
});

const Border = observer(({ tab }: { tab: Tab }) => {
  return <StyledBorder visible={tab.borderVisible} />;
});

const onMouseHover = () => {};

const Overlay = observer(({ tab }: { tab: Tab }) => {
  return (
    <StyledOverlay
      hovered={tab.isHovered}
      style={{
        backgroundColor: !!tab.isSelected ? store.theme["tab-overlay-color"] : '',
      }}
    />
  );
});

export default observer(({ tab }: { tab: Tab }) => {
  return (
    <StyledTab
      selected={tab.isSelected}
      onMouseDown={onMouseDown(tab)}
      onMouseEnter={onMouseEnter(tab)}
      onContextMenu={contextMenu(tab)}
      onClick={onClick(tab)}
      title={tab.title}
      onMouseLeave={onMouseLeave}
      onMouseOver={onMouseHover}
      visible={tab.tabGroupId === store.tabGroups.currentGroupId}
      ref={tab.ref}
    >
      <TabContainer
        selected={tab.isSelected}
        hovered={tab.isHovered}
        style={{
          backgroundColor: tab.isSelected 
          ? store.theme['primary'] : store.theme['tab-inactive-color']
        }}
      >
        <Content tab={tab} />
        <Close tab={tab} />

        {/* <Overlay tab={tab} />
        <Ripple
          rippleTime={0.4}
          opacity={0.15}
          color={tab.background}
          style={{ zIndex: 9 }}
        /> */}
      </TabContainer>
      <Border tab={tab} />
    </StyledTab>
  );
});
