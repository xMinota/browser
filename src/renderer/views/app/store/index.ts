import * as React from 'react';
import { observable, computed } from 'mobx';

import { TabsStore } from './tabs';
import { TabGroupsStore } from './tab-groups';
import { AddTabStore } from './add-tab';
import { ipcRenderer, remote, IpcRendererEvent } from 'electron';
import { HistoryStore } from './history';
import { FaviconsStore } from './favicons';
import { SuggestionsStore } from './suggestions';
import { extname } from 'path';
import { BookmarksStore } from './bookmarks';
import { DownloadsStore } from './downloads';
import { LocaleStore } from './locale';
import { AutofillStore } from './autofill';
import { AbStore } from './adblockwindow';
import { WeatherStore } from './weather';
import { NewsStore } from './news';
import { UserStore } from './user';
import { OptionsStore } from './settings';
import { getTheme } from '~/shared/utils/themes';
import { PreferencesStore } from './preferences';
import { NEWTAB_URL } from '../constants';
import FormattedURL from '@dothq/url'
import { isURL } from '~/shared/utils/url';
import { IParts } from '~/interfaces/parts';

export class Store {
  public history = new HistoryStore();
  public bookmarks = new BookmarksStore();
  public suggestions = new SuggestionsStore();
  public favicons = new FaviconsStore();
  public addTab = new AddTabStore();
  public tabGroups = new TabGroupsStore();
  public tabs = new TabsStore();
  public downloads = new DownloadsStore();
  public adblockwindow = new AbStore();
  public weather = new WeatherStore();
  public user = new UserStore();
  public locale = new LocaleStore();
  public news = new NewsStore();
  public autofill = new AutofillStore();
  public options = new OptionsStore();
  public preferences = new PreferencesStore(this);

  public app = require("electron").app;
  public remoteApp = require("electron").remote.app;
  public remote = require("electron").remote;
  public ipcMsg = require("electron").ipcRenderer;
  public ipcRec = require("electron").ipcMain;

  @observable
  public isFullscreen = false;

  @observable
  public isHTMLFullscreen = false;

  @observable
  public quickMenuVisible: boolean = false;

  @observable
  public dialogsVisibility: { [key: string]: boolean } = {
    'site-info': false,
  };

  @observable
  public addressbarTextVisible = true;

  @observable
  public addressbarEditing = false;

  @observable
  public updateInfo = {
    available: false,
    version: '',
  };

  @observable
  public navigationState = {
    canGoBack: false,
    canGoForward: false,
  };

  public searchInputRef = React.createRef<HTMLInputElement>();
  public findInputRef = React.createRef<HTMLInputElement>();

  public canToggleMenu = false;

  @computed
  public get theme() {
    return getTheme(this.preferences.conf.appearance.theme)
  }

  @observable
  public isMaximized: boolean;

  public mouse = {
    x: 0,
    y: 0,
  };

  public windowId = remote.getCurrentWindow().id;

  public loaded: boolean = false;

  @computed
  public get addressbarValue() {
    const tab = this.tabs.selectedTab;
    if (tab?.addressbarValue != null) return decodeURI(tab?.addressbarValue);
    else if (tab && !tab?.url?.startsWith(NEWTAB_URL))
      return decodeURI(tab.url[tab.url.length - 1] === '/'
        ? tab.url.slice(0, -1)
        : tab.url);
    return '';
  }

  @computed
  public get addressbarParts() {
    let capturedText = '';
    let grayOutCaptured = false;
    let hostnameCaptured = false;
    let protocolCaptured = false;
    const segments: IParts[] = [];

    const url = decodeURI(this.addressbarValue);

    const whitelistedProtocols = ['https', 'http', 'ftp', 'dot'];

    for (let i = 0; i < url.length; i++) {
      const protocol = whitelistedProtocols.find(
        x => `${x}:/` === capturedText,
      );
      if (url[i] === '/' && protocol && !protocolCaptured) {
        segments.push({
          value: `${protocol}://`,
          grayOut: true,
        });

        protocolCaptured = true;
        capturedText = '';
      } else if (
        url[i] === '/' &&
        !hostnameCaptured &&
        (protocolCaptured ||
          !whitelistedProtocols.find(x => `${x}:` === capturedText))
      ) {
        segments.push({
          value: capturedText,
          grayOut: false,
        });

        hostnameCaptured = true;
        capturedText = url[i];
        grayOutCaptured = true;
      } else {
        capturedText += url[i];
      }

      if (i === url.length - 1) {
        segments.push({
          value: capturedText,
          grayOut: grayOutCaptured,
        });
      }
    }

    return segments;
  }

  public constructor() {
    ipcRenderer.on(
      'update-navigation-state',
      (e: IpcRendererEvent, data: any) => {
        this.navigationState = data;
      },
    );

    ipcRenderer.once('visible', (e: IpcRendererEvent, flag: any) => {
      this.quickMenuVisible = flag;
    });

    ipcRenderer.on('fullscreen', (e: any, fullscreen: boolean) => {
      this.isFullscreen = fullscreen;
    });

    ipcRenderer.on('html-fullscreen', (e: any, fullscreen: boolean) => {
      this.isHTMLFullscreen = fullscreen;
    });

    ipcRenderer.on(
      'update-available',
      (e: IpcRendererEvent, version: string) => {
        this.updateInfo.version = version;
        this.updateInfo.available = true;
      },
    );

    ipcRenderer.on(
      'url-arguments-applied',
      (e: IpcRendererEvent, url: string) => {
        
        this.tabs.addTab({ url, active: true })
      },
    );

    ipcRenderer.on('find', () => {
      if (this.tabs.selectedTab) {
        this.tabs.selectedTab.findVisible = true;
      }
    });

    ipcRenderer.on('dialog-visibility-change', (e, name, state) => {
      this.dialogsVisibility[name] = state;
    });

    /* @todo Fix update checks */
    // ipcRenderer.send('update-check');

    requestAnimationFrame(() => {
      if (remote.process.argv.length > 1) {
        const path = remote.process.argv[1];
        const ext = extname(path);

        if (ext === '.html') {
          setTimeout(function(this: any) {
            this.tabs.addTab({ url: `file:///${path}`, active: true });
          }, 4000);
         
        }
      }
    });
  }

}

export default new Store();
