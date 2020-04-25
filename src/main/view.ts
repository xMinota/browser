import {
  BrowserView,
  BrowserWindow,
  shell,
  Menu,
  clipboard,
  nativeImage,
  dialog,
  ipcMain,
  app,
} from 'electron';
import { windowsManager } from '.';
import { resolve } from 'path';
import { ViewError } from '../renderer/views/app/models/error';
import { truncateStr } from '~/shared/mixins';
import { writeFileSync } from 'fs';
import colors from 'colors';
import { zoom } from '~/shared/events';
import { getAppPath } from '~/shared/mixins/directory';

console.log(resolve(`${getAppPath()}/build/preloads/view-preload.js`))

export class View extends BrowserView {
  public title: string = '';
  public url: string = '';
  public favicon: string = '';
  public tabId: number;
  public homeUrl: string = 'dot://newtab';
  public error: ViewError;

  constructor(id: number, url: string) {
    super({
      webPreferences: {
        sandbox: true,
        preload: resolve(`${getAppPath()}/build/preloads/view-preload.js`),
        nodeIntegration: false,
        additionalArguments: [`--tab-id=${id}`],
        contextIsolation: true,
        partition: 'persist:view',
        enableBlinkFeatures: 'ShadowDOMV0,CustomElementsV0,HTMLImports',
        scrollBounce: true,
        plugins: true,
        javascript: true,
        enableRemoteModule: true
      },
    });

    this.homeUrl = url;
    this.tabId = id;
    
    this.setBackgroundColor('#000');

    this.webContents.session.webRequest.onBeforeSendHeaders(
      (details, callback) => {
        const preferences = windowsManager.settings.conf;
        if (preferences.privacy.doNotTrack) details.requestHeaders['DNT'] = '1';
        callback({ requestHeaders: details.requestHeaders });
      },
    );

    this.webContents.userAgent =
      this.webContents.userAgent
      .replace(/ dot\\?.([^\s]+)/g, '')
      .replace(/ Electron\\?.([^\s]+)/g, '')
      .replace(/Chrome\\?.([^\s]+)/g, `Chrome/${windowsManager.versions.chromium}`)

      this.webContents.on('context-menu', (e, params) => {
        let menuItems: Electron.MenuItemConstructorOptions[] = [];
  
        if (params.mediaType == 'video' || params.mediaType == 'audio') {
          menuItems = menuItems.concat([
            {
              label: 'Open ' + params.mediaType + ' in new tab',
              click: () => {
                windowsManager.window.webContents.send('api-tabs-create', {
                  url: params.srcURL,
                  active: false,
                });
              },
            },
            {
              label: 'Save ' + params.mediaType,
              click: () => {
                this.webContents.downloadURL(params.srcURL);
              },
            },
            {
              label: 'Copy link',
              click: () => {
                clipboard.clear();
                clipboard.writeText(params.srcURL);
              },
            },
            {
              type: 'separator',
            },
          ]);
        }
  
        if (params.linkURL !== '') {
          menuItems = menuItems.concat([
            {
              label: 'Open link in new tab',
              click: () => {
                windowsManager.window.webContents.send('api-tabs-create', {
                  url: params.linkURL,
                  active: false,
                });
              },
            },
            {
              type: 'separator',
            },
            {
              label: 'Copy link address',
              click: () => {
                clipboard.clear();
                clipboard.writeText(params.linkURL);
              },
            },
            {
              type: 'separator',
            },
          ]);
        }
  
        if (params.hasImageContents) {
          menuItems = menuItems.concat([
            {
              label: 'Open image in new tab',
              click: () => {
                windowsManager.window.webContents.send('api-tabs-create', {
                  url: params.srcURL,
                  active: false,
                });
              },
            },
            {
              label: 'Save image',
              click: () => {
                this.webContents.downloadURL(params.srcURL);
              },
            },
            {
              label: 'Copy image',
              click: () => {
                const img = nativeImage.createFromDataURL(params.srcURL);
  
                clipboard.clear();
                clipboard.writeImage(img);
              },
            },
            {
              label: 'Copy image address',
              click: () => {
                clipboard.clear();
                clipboard.writeText(params.srcURL);
              },
            },
            {
              type: 'separator',
            },
          ]);
        }
  
        if (params.isEditable) {
          menuItems = menuItems.concat([
            {
              role: 'undo',
              accelerator: 'CmdOrCtrl+Z',
            },
            {
              role: 'redo',
              accelerator: 'CmdOrCtrl+Y',
            },
            {
              type: 'separator',
            },
            {
              role: 'cut',
              enabled: params.selectionText.length >= 1,
            },
            {
              role: 'copy',
              accelerator: 'CmdOrCtrl+C',
              enabled: params.selectionText.length >= 1,
            },
            {
              role: 'paste',
              accelerator: 'CmdOrCtrl+V',
            },
            {
              role: 'selectAll',
              accelerator: 'CmdOrCtrl+A',
            },
            {
              type: 'separator',
            },
          ]);
        }
  
        if (
          !params.isEditable &&
          params.selectionText !== '' &&
          !params.hasImageContents
        ) {
          menuItems = menuItems.concat([
            {
              role: 'copy',
              accelerator: 'CmdOrCtrl+C',
            },
            {
              label: `Search the web for "${truncateStr(
                params.selectionText,
                16,
                '...',
              )}"`,
              click: () => {
                var url = `https://google.com/search?q=${params.selectionText}`;
  
                this.webContents.loadURL(url);
              },
            },
          ]);
        }
  
        if (
          !params.hasImageContents &&
          params.linkURL === '' &&
          params.selectionText === '' &&
          !params.isEditable
        ) {
          menuItems = menuItems.concat([
            {
              label: 'Back              ',
              accelerator: 'Alt+Left',
              enabled: this.webContents.canGoBack(),
              click: () => {
                this.webContents.goBack();
              },
            },
            {
              label: 'Forward         ',
              accelerator: 'Alt+Right',
              enabled: this.webContents.canGoForward(),
              click: () => {
                this.webContents.goForward();
              },
            },
            {
              label: 'Refresh',
              accelerator: 'F5',
              click: () => {
                this.webContents.reload();
              },
            },
            {
              type: 'separator',
            },
            {
              label: 'Save as',
              accelerator: 'CmdOrCtrl+S',
              click: () => {
                dialog.showSaveDialog(windowsManager.window, {
                  defaultPath: `${windowsManager.window.viewManager.selected.title}.html`,
                  filters: [
                    {
                      name: "Web Page, HTML Only",
                      extensions: ["html", "htm"]
                    },
                    {
                      name: "Web Page, Single File",
                      extensions: ["mhtml"]
                    },
                    {
                      name: "Web Page, Complete",
                      extensions: ["htm", "html"]
                    },
                    { name: 'All Files', extensions: ['*'] }
                  ]
                }).then(result => {
                  if(result.filePath == undefined) return;
 
                  windowsManager.window.viewManager.selected.webContents.savePage(result.filePath, "HTMLComplete")
                }).catch(err => {
                  console.log(`${colors.blue.bold('View')} Failed to save page`, err);
                })
              },
            },
            {
              label: 'Print',
              accelerator: 'CmdOrCtrl+P',
              click: () => {
                windowsManager.window.dialogs.alert.show();
                windowsManager.window.dialogs.alert.action = "alert";
                windowsManager.window.dialogs.alert.send("Print is disabled right now. However, you can expect it to return soon!");
              },
            },
          ]);
        }
  
        menuItems.push(
          {
            type: 'separator',
          },
          {
            label: 'View source',
            click: () => {
              if (this.webContents.getURL().substr(0, 12) != 'view-source:') {
                var url = `view-source:${this.webContents.getURL()}`;
  
                this.webContents.loadURL(url);
              }
            },
          },
          {
            label: 'Inspect',
            accelerator: 'F12',
            click: () => {
              if (this.webContents.getURL()) {
                this.webContents.inspectElement(params.x, params.y);
  
                if (this.webContents.isDevToolsOpened()) {
                  this.webContents.devToolsWebContents.focus();
                  this.webContents.devToolsWebContents.toggleDevTools();
                }
              }
            },
          },
        );
  
        const menu = Menu.buildFromTemplate(menuItems);
  
        menu.popup();
    });

    this.webContents.addListener('zoom-changed', (e, zoomDirection) => zoom(zoomDirection, windowsManager.window))

    this.webContents.addListener('found-in-page', (e, result) => {
      windowsManager.window.webContents.send('found-in-page', result);
    });

    this.webContents.once('media-started-playing', (listener: any) => {
      windowsManager.window.webContents.send(`audio-playing-${this.tabId}`);
    });

    this.webContents.once('media-paused', (listener: any) => {
      windowsManager.window.webContents.send(`audio-stopped-${this.tabId}`);
    });

    this.webContents.addListener('did-stop-loading', () => {
      this.updateNavigationState();
      windowsManager.window.webContents.send(`view-loading-${this.tabId}`, false, this.url);
    });

    this.webContents.addListener('did-start-loading', () => {
      this.updateNavigationState();
      windowsManager.window.webContents.send(`view-loading-${this.tabId}`, true, this.url);
    });

    this.webContents.addListener('did-fail-load', 
      (event: Electron.Event, errorCode: number, errorDescription: string, validatedURL: string, isMainFrame: boolean) => {
        if(isMainFrame == true) {
          this.error = {
            code: errorCode,
            description: errorDescription,
            url: validatedURL
          }

          console.log(this.error)

        }
      }
    )

    this.webContents.addListener('did-start-navigation', async (e, ...args) => {
      this.updateNavigationState();

      this.favicon = '';

      windowsManager.window.webContents.send(`load-commit-${this.tabId}`, ...args);
    });

    this.webContents.addListener('did-navigate', async (e, url) => {
      windowsManager.window.webContents.send(
        `view-did-navigate-${this.webContents.id}`,
        url,
        this.webContents.getTitle(),
        true
      );

      this.updateURL(url);
    });

    this.webContents.addListener(
      'did-navigate-in-page',
      async (e, url, isMainFrame) => {
        if (isMainFrame) {
          windowsManager.window.webContents.send(
            `view-did-navigate-${this.webContents.id}`,
            url,
            this.webContents.getTitle(),
            true
          );

          this.updateURL(url);
        }
      },
    );


    this.webContents.addListener(
      'new-window',
      (e, url, frameName, disposition) => {
        if (disposition === 'new-window') {
          if (frameName === '_self') {
            e.preventDefault();
            windowsManager.window.viewManager.selected.webContents.loadURL(url);
          } else if (frameName === '_blank') {
            e.preventDefault();
            windowsManager.window.webContents.send('api-tabs-create', {
              url,
              active: true,
            });
          }
        } else if (disposition === 'foreground-tab') {
          e.preventDefault();
          windowsManager.window.webContents.send('api-tabs-create', {
            url,
            active: true,
          });
        } else if (disposition === 'background-tab') {
          e.preventDefault();
          windowsManager.window.webContents.send('api-tabs-create', {
            url,
            active: false,
          });
        }
      },
    );

    this.webContents.addListener(
      'page-favicon-updated',
      async (e, favicons) => {
        if(!favicons || !favicons[0]) return;

        this.favicon = favicons[0];

        windowsManager.window.webContents.send(
          `browserview-favicon-updated-${this.tabId}`,
          favicons[0],
          windowsManager.settings.conf.appearance.theme
        );
      },
    );

    this.webContents.addListener('did-change-theme-color', (e, color) => {
      windowsManager.window.webContents.send(
        `browserview-theme-color-updated-${this.tabId}`,
        color,
      );
    });

    ipcMain.on(`browserview-title-updated-${this.tabId}`, (e, title) => {
      windowsManager.window.webContents.send(
        `browserview-title-updated-${this.tabId}`,
        title
      )
    })

    this.setAutoResize({ width: true, height: true, horizontal: false, vertical: false });
    this.webContents.loadURL(url);
  }

  public emitWebNavigationEvent = (name: string, ...data: any[]) => {
    this.webContents.send(`api-emit-event-webNavigation-${name}`, ...data);
  };

  public updateNavigationState() {
    if (this.isDestroyed()) return;

    windowsManager.window.webContents.send('update-navigation-state', {
      canGoBack: this.webContents.canGoBack(),
      canGoForward: this.webContents.canGoForward(),
    });
  }

  public updateURL = (url: string) => {
    windowsManager.window.webContents.send(`browserview-url-updated-${this.tabId}`, url)

    if (this.url === url) return;

    this.url = url;
  };

}
