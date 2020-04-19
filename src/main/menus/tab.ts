import store from '~/renderer/views/app/store';
import { NEWTAB_URL } from '~/renderer/views/app/constants';
import { Tab } from '~/renderer/views/app/models';
import { remote } from 'electron';

export const getTabMenu = (tab: Tab, tabs) => {
    const menu: Electron.MenuItemConstructorOptions[] = [
        {
            label: 'New Tab',
            accelerator: 'CmdOrCtrl+T',
            click: () => {
                const url = NEWTAB_URL;
                store.tabs.addTab({ url, active: true });
            },
        },
        { type: 'separator', },
        {
            label: 'Reload',
            accelerator: 'F5',
            click: () => {
                tab.callViewMethod('webContents.reload');
            },
        },
        {
            label: 'Duplicate',
            click: () => {
                store.tabs.addTab({ active: true, url: tab.url });
            },
        },
        { type: 'separator' },
        {
            label: 'Close tab',
            accelerator: 'CmdOrCtrl+W',
            click: () => {
                tab.close();
            },
        },
        {
            label: 'Close other tabs',
            enabled: store.tabs.list.length < 1,
            click: () => {
                for (const t of tabs) {
                    if (t !== tab) {
                        t.close();
                    }
                }
            },
        },
        { type: 'separator' },
        {
            label: 'Close tabs from left',
            enabled: store.tabs.list.length != 1,
            click: () => {
                for (let i = tabs.indexOf(tab) - 1; i >= 0; i--) {
                    tabs[i].close();
                }
            },
        },
        {
            label: 'Close tabs from right',
            enabled: store.tabs.list.length != 1,
            click: () => {
                for (let i = tabs.length - 1; i > tabs.indexOf(tab); i--) {
                    tabs[i].close();
                }
            },
        },
        {
            label: 'Reopen last closed tab',
            accelerator: 'CmdOrCtrl+Shift+T',
            enabled: store.tabs.lastUrl != '',
            click: () => {
                var url = store.tabs.lastUrl[store.tabs.lastUrl.length - 1];
                if (url != '') {
                    store.tabs.addTab({ url, active: true });
                    store.tabs.lastUrl.splice(-1, 1);
                }
            },
        }
    ]

    return remote.Menu.buildFromTemplate(menu);
}