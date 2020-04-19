import { observable, computed, action } from 'mobx';
import * as React from 'react';
import { ipcRenderer } from 'electron';
import Vibrant = require('node-vibrant')
import { remote } from 'electron';

import store from '~/renderer/views/app/store';
import {
  TABS_PADDING,
  TOOLBAR_HEIGHT,
  defaultTabOptions,
  TAB_ANIMATION_DURATION,
  TAB_MAX_WIDTH,
  NEWTAB_URL,
} from '~/renderer/views/app/constants';
import { getColorBrightness } from '../utils';
import { colors } from '~/renderer/constants';
import { makeId } from '~/shared/utils/string';
import { ClosedTabs } from './closed-tabs';
import { getHostname } from '~/shared/utils/url';

let id = 1;

export class Tab {
  @observable
  public id: number = id++;

  @observable
  public isDragging: boolean = false;

  @observable
  public title: string = 'New Tab';

  @observable
  public originalTitle: string = 'New Tab';

  @observable
  public loading: boolean = false;

  @observable
  public favicon: string;

  @observable
  public tabGroupId: number;

  @observable
  public width: number = 0;

  @observable
  public position = 0;

  @observable
  public isUrlVisible: boolean = false;

  @observable
  public background: string = colors.blue['500'];

  @observable
  public url = '';

  @observable
  private _findVisible = false;

  @observable
  public findOccurrences = '0/0';

  @observable
  public findText = '';

  @observable
  public blockedAds = 0;

  @observable
  public f = 0;

  @observable
  public closedTabs: ClosedTabs[] = [];

  @observable
  public zoomAmount: number = 1;

  @observable
  public refreshAnimationStarted: boolean = false;

  @computed
  public get findVisible() {
    return this._findVisible;
  }

  public webContents() {
    return remote.webContents.fromId(this.webContentsId);
  }

  public muteTab() {
    if (this.audioPlaying == true) {
      ipcRenderer.send('audio-pause');
      this.audioPlaying = false;
    } else {
      ipcRenderer.send('audio-resume');
      this.audioPlaying = true;
    }
  }

  public set findVisible(val: boolean) {
    this._findVisible = val;

    if (val) {
      ipcRenderer.send('window-focus');
    }

    requestAnimationFrame(() => {
      store.tabs.updateTabsBounds(true);
      if (val && store.findInputRef.current) {
        store.findInputRef.current.focus();
      }
    });
  }

  @computed
  public get isSelected() {
    return store.tabs.selectedId === this.id;
  }

  @computed
  public get isHovered() {
    return store.tabs.hoveredTabId === this.id;
  }

  @computed
  public get borderVisible() {
    const tabs = this.tabGroup.tabs
      .slice()
      .sort((a, b) => a.position - b.position);

    const i = tabs.indexOf(this);
    const nextTab = tabs[i + 1];

    if (
      (nextTab && (nextTab.isHovered || nextTab.isSelected)) ||
      this.isSelected ||
      this.isHovered
    ) {
      return false;
    }

    return true;
  }

  @computed
  public get isExpanded() {
    return this.isHovered || this.isSelected || !store.tabs.scrollable;
  }

  @computed
  public get isIconSet() {
    return this.favicon !== '' || this.loading;
  }

  public left = 0;
  public tempPosition = 0;
  public lastUrl: any = [];
  public isClosing = false;
  public ref = React.createRef<HTMLDivElement>();
  public lastHistoryId: string;
  public hasThemeColor = false;
  public webContentsId: number;
  public findRequestId: number;
  public isWindow: boolean = false;
  public audioPlaying: boolean = false;

  @observable
  public addressbarValue: string = null;

  public addressbarFocused = false;
  public addressbarSelectionRange = [0, 0];

  constructor({ url, active } = defaultTabOptions, tabGroupId: number) {
    this.tabGroupId = tabGroupId;

    this.position = this.tabGroup.nextPosition++;
    this.tempPosition = this.position;

    ipcRenderer.send('browserview-create', { tabId: this.id, url });

    ipcRenderer.once(`browserview-created-${this.id}`, (e: any, id: number) => {
      this.webContentsId = id;
      if (active) {
        this.select();

        if(url == NEWTAB_URL) {
          store.searchInputRef.current.click()
        }
      }
    });

    ipcRenderer.on(
      `browserview-data-updated-${this.id}`,
      async (e: any, { title, url, zoomAmount }: any) => {
        let updated = null;

        this.lastHistoryId = await store.history.addItem({
          title: this.title,
          url,
          favicon: this.favicon,
          date: new Date().toString(),
        });

        updated = {
          url,
        };

        if (updated) {
          this.emitOnUpdated(updated);
        }

        this.title = title;
        this.url = url;
        this.zoomAmount = zoomAmount;

        this.updateData();
      },
    );

    ipcRenderer.on(
      `load-commit-${this.id}`,
      async (
        e,
        event,
        url: string,
        isInPlace: boolean,
        isMainFrame: boolean,
      ) => {
        if (isMainFrame) {
          this.blockedAds = 0;
        }
      },
    );

    ipcRenderer.on(
      `browserview-tab-info-updated-${this.id}`, async (e) => {
        this.background = colors.blue['500'];
        this.hasThemeColor = false;
        this.favicon = undefined;
    })

    ipcRenderer.on(
      `browserview-favicon-updated-${this.id}`,
      async (e: any, favicon: string, theme: string) => {
        try {
          const fav = await store.favicons.addFavicon(favicon);
          if(fav == "") {
            this.favicon = '';
            this.background = colors.blue['500'];
          } else {
            const buf = Buffer.from(fav.split('base64,')[1], 'base64');

            this.favicon = favicon;
  
            if (!this.hasThemeColor) {
              const palette = await Vibrant.from(buf).getPalette();
  
              if (!palette.Vibrant) return;
  
              if (getColorBrightness(palette.Vibrant.hex) < 170) {
                this.background =
                  theme == 'light'
                    ? palette.Vibrant.hex
                    : palette.DarkVibrant.hex;
              } else {
                this.background = colors.blue['500'];
              }
            }
          }
        } catch (e) {
          console.log(e)
          this.favicon = '';
          this.background = colors.blue['500'];
        }
        this.updateData();
      },
    );

    ipcRenderer.on(`blocked-ad-${this.id}`, () => {
      this.blockedAds++;

      ipcRenderer.send(`session-blocked-ad`);
    });

    ipcRenderer.on(
      `browserview-theme-color-updated-${this.id}`,
      (e: any, themeColor: string) => {
        if (themeColor && getColorBrightness(themeColor) < 170) {
          this.background = themeColor;
          this.hasThemeColor = true;
        } else {
          this.background = colors.blue['500'];
          this.hasThemeColor = false;
        }
      },
    );

    ipcRenderer.on(
      `browserview-title-updated-${this.id}`,
      (e: any, title: string) => {
        this.title = title;
      }
    )

    ipcRenderer.on(
      `browserview-url-updated-${this.id}`,
      (e: any, url: string) => {
        this.url = url;

        if (this.id === store.tabs.selectedId && !store.addressbarEditing) {
          this.addressbarValue = null;
        }
      }
    )

    ipcRenderer.on(
      `view-did-navigate-${this.id}`,
      (e: any, url: string, title: string, isMainFrame: boolean) => {
        this.url = url;
        this.title = title;
        
        if(isMainFrame) this.favicon = '';

        if (this.id === store.tabs.selectedId && !store.addressbarEditing) {
          this.addressbarValue = null;
        }
      }
    )

    ipcRenderer.on(`view-loading-${this.id}`, (e: any, loading: boolean, url: string) => {
      this.loading = loading;

      this.emitOnUpdated({
        status: loading ? 'loading' : 'complete',
      });
    });

    ipcRenderer.once(`audio-playing-${this.id}`, (e: any) => {
      this.select();
      this.originalTitle = this.title;
      this.audioPlaying = true;
    });

    ipcRenderer.once(`audio-stopped-${this.id}`, (e: any) => {
      this.select();
      this.audioPlaying = false;
      this.title = this.originalTitle;
    });
  }

  @action
  public updateData() {
    if (this.lastHistoryId) {
      const { title, url, favicon } = this;

      const item = store.history.getById(this.lastHistoryId);

      if (item) {
        item.title = title;
        item.url = url;
        item.favicon = favicon;
      }

      store.history.db.update(
        {
          _id: this.lastHistoryId,
        },
        {
          $set: {
            title,
            url,
            favicon,
          },
        },
      );
    }
  }

  public get tabGroup() {
    return store.tabGroups.getGroupById(this.tabGroupId);
  }

  @action
  public select() {
    if (!this.isClosing) {
      store.canToggleMenu = this.isSelected;

      store.tabs.selectedId = this.id;

      ipcRenderer.send('browserview-select', this.id);

      store.tabs.emitEvent('onActivated', {
        tabId: this.id,
        windowId: 0,
      });

      requestAnimationFrame(() => {
        store.tabs.updateTabsBounds(true);
      });
    }
  }

  public getWidth(containerWidth: number = null, tabs: Tab[] = null) {
    if (containerWidth === null) {
      containerWidth = store.tabs.containerWidth;
    }

    if (tabs === null) {
      tabs = store.tabs.list.filter(
        x => x.tabGroupId === this.tabGroupId && !x.isClosing,
      );
    }

    const width = containerWidth / tabs.length - TABS_PADDING;

    if (width > TAB_MAX_WIDTH) {
      return TAB_MAX_WIDTH;
    }
    if (width < 72) {
      return 72;
    }

    return width;
  }

  public getLeft(reordering: boolean = false, calcNewLeft: boolean = false) {
    const tabs = this.tabGroup.tabs.slice();

    if (reordering) {
      tabs.sort((a, b) => a.tempPosition - b.tempPosition);
    } else {
      tabs.sort((a, b) => a.position - b.position);
    }

    const index = tabs.indexOf(this);

    let left = 0;
    for (let i = 0; i < index; i++) {
      left += (calcNewLeft ? this.getWidth() : tabs[i].width) + TABS_PADDING;
    }

    return left;
  }

  @action
  public setLeft(left: number, animation: boolean) {
    store.tabs.animateProperty('x', this.ref.current, left, animation);
    this.left = left;
  }

  @action
  public setWidth(width: number, animation: boolean) {
    store.tabs.animateProperty('width', this.ref.current, width, animation);
    this.width = width;
  }

  @action
  public hardReload() {
    ipcRenderer.send('browserview-destroy', this.id);
  }

  @action
  public close() {
    const tabGroup = this.tabGroup;
    const tabs = tabGroup.tabs.slice().sort((a, b) => a.position - b.position);

    store.tabs.lastUrl.push(this.url);

    const selected = store.tabs.selectedId === this.id;

    ipcRenderer.send('browserview-destroy', this.id);

    const notClosingTabs = tabs.filter(x => !x.isClosing);
    let index = notClosingTabs.indexOf(this);

    store.tabs.resetRearrangeTabsTimer();

    this.isClosing = true;
    if (notClosingTabs.length - 1 === index) {
      const previousTab = tabs[index - 1];
      if (previousTab) {
        this.setLeft(previousTab.getLeft(false, true) + this.getWidth(), true);
      }
      store.tabs.updateTabsBounds(true);
    }

    this.setWidth(0, true);
    store.tabs.setTabsLefts(true);

    if (selected) {
      index = tabs.indexOf(this);

      if (
        index + 1 < tabs.length &&
        !tabs[index + 1].isClosing &&
        !store.tabs.scrollable
      ) {
        const nextTab = tabs[index + 1];
        nextTab.select();
      } else if (index - 1 >= 0 && !tabs[index - 1].isClosing) {
        const prevTab = tabs[index - 1];
        prevTab.select();
      } else if (store.tabGroups.list.length === 1) {
        remote.app.quit();
      } else if (this.tabGroup.tabs.length === 0) {
        remote.app.quit();
      }
    }

    setTimeout(() => {
      store.tabs.removeTab(this.id);
    }, TAB_ANIMATION_DURATION * 1000);
  }

  public emitOnUpdated = (data: any) => {
    store.tabs.emitEvent('onUpdated', this.id, data, this.getApiTab());
  };

  callViewMethod = (scope: string, ...args: any[]): Promise<any> => {
    return new Promise(resolve => {
      const callId = makeId(32);
      ipcRenderer.send('browserview-call', {
        args,
        scope,
        tabId: this.id,
        callId,
      });

      ipcRenderer.once(
        `browserview-call-result-${callId}`,
        (e: any, result: any) => {
          resolve(result);
        },
      );
    });
  };

  public getApiTab(): chrome.tabs.Tab {
    const selected = this.isSelected;

    return {
      id: this.id,
      index: this.tabGroup.tabs.indexOf(this),
      title: this.title,
      pinned: false,
      favIconUrl: this.favicon,
      url: this.url,
      status: this.loading ? 'loading' : 'complete',
      width: this.width,
      height: TOOLBAR_HEIGHT,
      active: selected,
      highlighted: selected,
      selected,
      windowId: 0,
      discarded: false,
      incognito: false,
      autoDiscardable: false,
    };
  }
}
