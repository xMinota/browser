import { DEFAULT_PREFERENCES_OBJECT } from '../../shared/models/default-preferences';

import { EventEmitter } from 'events';
import { promises } from 'fs';
import { preferencesLocation } from '../services';
import { WindowsManager } from '../windows-manager';
import { ipcMain } from 'electron';
import colors from 'colors';

export class Preferences extends EventEmitter {
    public conf = DEFAULT_PREFERENCES_OBJECT;

    private loaded = false;

    private windowsManager: WindowsManager;

    private onLoad = async (): Promise<void> => {
        return new Promise(resolve => {
          if (!this.loaded) {
            this.once('load', () => {
              resolve();
            });
          } else {
            resolve();
          }
        });
    };

    constructor(manager: WindowsManager) {
        super();

        this.windowsManager = manager;

        ipcMain.on('save-settings', async (event, data) => {
          this.save(data)

          this.pushChanges()
        });

        ipcMain.on('get-settings-sync', async e => {
            await this.onLoad();
            if(!this.loaded) {
              this.load()
            }
            e.returnValue = this.conf;
        });
      
        ipcMain.on('get-settings', async e => {
            await this.onLoad();
            e.sender.send('update-settings', this.conf);
        });

        this.load()
    }

    private async load() {
      try {
        const file = await promises.readFile(preferencesLocation, 'utf-8');

        let preferences = DEFAULT_PREFERENCES_OBJECT;
        let requiresSave = false;

        if(this.isJSON(file)) {
          preferences = JSON.parse(file);
        } else {
          requiresSave = true;
        }

        this.conf = preferences;

        this.loaded = true;
        this.emit('load');

        if(requiresSave == true) {
          this.save({ data: this.conf, caller: 'browser-main', reason: 'Preferences file was missing vital information.' })
        }

        
      } catch (e) {
        console.log(e)
      }
    }

    private async save(data) {
      if(!data.data || !data.caller || !data.reason || data.reason.length <= 5) {
        return;
      }

      this.conf = data.data;
      await promises.writeFile(preferencesLocation, JSON.stringify(data.data));

      this.windowsManager.window.webContents.send("update-settings", this.conf);

      console.log(`${colors.blue.bold('Security')} The vendor \`${data.caller}\` modified browser preferences with reason \`${data.reason}\``);
    }
    
    private isJSON = (str) => {
      try {
          return (JSON.parse(str) && !!str);
      } catch (e) {
          return false;
      }
    }
    
    private pushChanges() {
      Object.values(this.windowsManager.window.dialogs).forEach(dialog => {
        dialog.webContents.send('update-settings', this.conf)
      })
    }
}