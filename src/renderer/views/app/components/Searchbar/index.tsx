import { observer } from 'mobx-react';
import * as React from 'react';

import store from '~/renderer/views/app/store';
import { StyledToolbar, Buttons, ToolbarWrap, Search, Input, SearchIcon, URLPartContainer, Part } from './style';
import { NavigationButtons } from '../NavigationButtons';
import ToolbarButton from "../ToolbarButton";
import { icons, WEBUI_BASE } from '../../constants';
import BrowserAction from '../BrowserAction';
import { AbButton } from '../ToolbarButton/style';
import { shadeBlendConvert } from '../../utils';
import { colors } from '~/renderer/constants';
import { ipcRenderer } from 'electron';
import { isURL } from '~/shared/utils/url';

const onUpdateClick = () => {
  ipcRenderer.send('update-install');
};

export const audioPlaying = () => {
  if(store.tabs.selectedTab) {
    if(store.tabs.selectedTab.audioPlaying == true) {
      return "This tab is playing audio."
    }
    else {
      return "This tab is not playing audio or has been pasued."
    }
  }
  else {
    return ""
  }
}

export const audioVisible = () => {
  if(store.tabs.selectedTab) {
    if(store.tabs.selectedTab.audioPlaying == true) {
      return true
    }
    if(store.tabs.selectedTab.audioPlaying == false) {
      return false
    }
  }
  else {
    return false
  }
}

const resetZoom = () => {
  ipcRenderer.send("reset-zoom");
  store.tabs.selectedTab.zoomAmount = 1;
}

let mouseUpped = false;

const onMouseDown = (e: React.MouseEvent<HTMLInputElement>) => {
  store.addressbarTextVisible = false;
  store.addressbarEditing = true;
};

const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
  store.addressbarTextVisible = false;
  store.addressbarEditing = true;

  if (store.tabs.selectedTab) {
    store.tabs.selectedTab.addressbarFocused = true;
  }
};

const onSelect = (e: React.MouseEvent<HTMLInputElement>) => {
  if (store.tabs.selectedTab) {
    store.tabs.selectedTab.addressbarSelectionRange = [
      e.currentTarget.selectionStart,
      e.currentTarget.selectionEnd,
    ];
  }
};

const onMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
  if (window.getSelection().toString().length === 0 && !mouseUpped) {
    e.currentTarget.select();
  }

  mouseUpped = true;
};

const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === 'Escape' || e.key === 'Enter') {
    store.addressbarEditing = false;
    store.tabs.selectedTab.addressbarValue = null;
  }

  if (e.key === 'Escape') {
    const target = e.currentTarget;
    requestAnimationFrame(() => {
      target.select();
    });
  }

  if (e.key === 'Enter') {
    e.currentTarget.blur();
    const { value } = e.currentTarget;
    let url = value;

    if (isURL(value)) {
      url = value.indexOf('://') === -1 ? `http://${value}` : value;
    } else {
      url = `https://google.com/search?q=${value}`;
    }

    store.tabs.selectedTab.addressbarValue = url;
    store.tabs.selectedTab.callViewMethod('webContents.loadURL', url);
  }
};

const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  store.tabs.selectedTab.addressbarValue = e.currentTarget.value;
};

const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  e.currentTarget.blur();
  window.getSelection().removeAllRanges();
  store.addressbarTextVisible = true;
  store.addressbarEditing = false;
  mouseUpped = false;

  if (store.tabs.selectedTab) {
    store.tabs.selectedTab.addressbarFocused = false;
  }
};

const onSearchIconClick = () => {
  const tab = store.tabs.selectedTab;

  const type = tab.url.startsWith(WEBUI_BASE)
                ? "webui" 
                : tab.url.startsWith("https://") || tab.url.startsWith("http://") 
                  ? "webpage"
                  : tab.url.startsWith("file:")
                    ? "file"
                    : ""

  const connectionType = tab.url.startsWith("https://") 
                          ? "secure" 
                          : tab.url.startsWith("http://")
                            ? "insecure"
                            : null

  ipcRenderer.send(`show-site-info-${store.windowId}`, { 
    url: tab.url,
    type,
    connectionType,
  })
}

export const Searchbar = observer(() => {
  return (
    <StyledToolbar>
      <ToolbarWrap>
        <NavigationButtons />
        <Search>
          <SearchIcon selected={store.dialogsVisibility.siteinfo} icon={store.tabs.selectedTab &&
            store.tabs.selectedTab.addressbarFocused 
              ? icons.search
              : store.addressbarValue == ''
                ? icons.search
                : store.addressbarEditing == false
                  ? store.tabs.selectedTab.url.startsWith("https://") 
                    ? icons.secure
                    : icons.info
                  : icons.search
          } onClick={onSearchIconClick} />
          <Input
            ref={store.searchInputRef}
            spellCheck={false}
            onKeyDown={onKeyDown}
            onMouseDown={onMouseDown}
            onSelect={onSelect}
            onBlur={onBlur}
            onFocus={onFocus}
            onMouseUp={onMouseUp}
            onChange={onChange}
            placeholder="Search or enter address"
            value={store.addressbarValue}
            visible={store.addressbarTextVisible}
            focused={store.addressbarEditing}
          />
          <URLPartContainer visible={store.addressbarValue.length == 0 ? false : !!store.addressbarTextVisible}>
            {store.addressbarParts.map((item, key) => (
              <Part
                key={key}
                style={{
                  color: item.grayOut ? store.theme['search-dim'] : store.theme['search-bright'],
                  overflow: item.value.startsWith("/") ? 'hidden' : ''
                }}
              >
                {item.value}
              </Part>
            ))}
          </URLPartContainer>
        </Search>
        <Buttons>
          {store.updateInfo.available && (
            <ToolbarButton icon={icons.download} onClick={onUpdateClick} />
          )}
          <AbButton title={audioPlaying()}>
            <BrowserAction
              size={16}
              style={{ marginLeft: 0 }}
              opacity={0.8}
              title="This tab is playing audio."
              visible={audioVisible()}
              data={{
                badgeBackgroundColor: store.tabs.selectedTab
                  ? store.tabs.selectedTab.background
                  : 'transparent',
                badgeText: store.tabs.selectedTab
                ? store.tabs.selectedTab.audioPlaying
                  ? ''
                  : ''
                : '',
                icon: icons.music,
                badgeTextColor: store.tabs.selectedTab
                  ? shadeBlendConvert(store.preferences.conf.appearance.theme == 'light' ? 0.85 : 0.3, store.tabs.selectedTab.background)
                  : 'transparent',
              }}
            />          
          </AbButton>
          <AbButton>
            <BrowserAction
              size={16}
              style={{ marginLeft: 0 }}
              opacity={0.8}
              title="Dot Downloads"
              visible={store.downloads.list.length > 0}
              data={{
                badgeBackgroundColor: store.tabs.selectedTab
                  ? store.tabs.selectedTab.background
                  : 'transparent',
                badgeText: store.tabs.selectedTab
                  ? store.downloads.list.length > 0
                    ? store.downloads.list.length.toString()
                    : ''
                  : '',
                icon: icons.download,
                badgeTextColor: store.tabs.selectedTab
                  ? shadeBlendConvert(store.preferences.conf.appearance.theme == 'light' ? 0.85 : 0.3, store.tabs.selectedTab.background)
                  : 'transparent',
              }}
            />          
          </AbButton>
          <AbButton onClick={resetZoom}>
            <BrowserAction
              size={18}
              style={{ marginLeft: 0 }}
              opacity={0.8}
              visible={store.tabs.selectedTab ? store.tabs.selectedTab.zoomAmount !== 1 : false}
              data={{
                badgeBackgroundColor: store.tabs.selectedTab
                  ? store.preferences.conf.appearance.theme == 'light'
                    ? store.tabs.selectedTab.background
                    : shadeBlendConvert(store.preferences.conf.appearance.theme !== 'dark' && store.preferences.conf.appearance.theme !== 'oled' ? 0.85 : 0.3, store.tabs.selectedTab.background)
                  : 'transparent',
                badgeText: store.tabs.selectedTab
                  ? store.tabs.selectedTab.zoomAmount !== 1
                    ? (store.tabs.selectedTab.zoomAmount * 100).toFixed(0).toString() + "%"
                    : ''
                  : '',
                icon: icons.zoom,
                badgeTextColor: colors.grey['100']
              }}
            />
          </AbButton>
          <AbButton title="You">
            <BrowserAction
              size={20}
              style={{ marginLeft: 0, borderRadius: '28px' }}
              opacity={0.8}
              title="You"
              visible={true}
              data={{
                badgeBackgroundColor: '',
                badgeText: '',
                icon: icons.user,
                badgeTextColor: ''
              }}
            />
          </AbButton>
          <AbButton title="Dot Ad-Blocker" id="dab">
            <BrowserAction
              size={16}
              style={{ marginLeft: 0 }}
              opacity={0.8}
              title="Dot Ad-Blocker"
              visible={store.preferences.conf.privacy.adblocker}
              data={{
                badgeBackgroundColor: store.tabs.selectedTab
                  ? store.preferences.conf.appearance.theme == 'light'
                    ? store.tabs.selectedTab.background
                    : shadeBlendConvert(store.preferences.conf.appearance.theme !== 'dark' && store.preferences.conf.appearance.theme !== 'oled' ? 0.85 : 0.3, store.tabs.selectedTab.background)
                  : 'transparent',
                badgeText: store.tabs.selectedTab
                  ? store.tabs.selectedTab.blockedAds > 0
                    ? store.tabs.selectedTab.blockedAds.toString()
                    : ''
                  : '',
                icon: icons.shield,
                badgeTextColor: colors.grey['100']
              }}
            />
          </AbButton>
        </Buttons>
      </ToolbarWrap>
    </StyledToolbar>
  );
});
