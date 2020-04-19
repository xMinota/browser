import { AppWindow } from '../app-window';
import { Dialog } from './dialog';
import { TOOLBAR_HEIGHT, SEARCHBAR_HEIGHT } from '~/renderer/views/app/constants';
import { windowsManager } from '..';
import { ipcMain } from 'electron';
import { IContent } from '~/interfaces/site-info';

let WIDTH = 350;
let HEIGHT = 280;

export class SiteInfoDialog extends Dialog {
  public visible = false;

  constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'siteinfo',
      bounds: {
        width: WIDTH,
        height: HEIGHT,
        y: 36,
      },
      devtools: true
    });

    ipcMain.on(`show-${this.webContents.id}`, () => {
      this.show();
    });
  }

  public rearrange() {
    const { showHomeButton } = windowsManager.settings.conf.appearance;
    var x = ((36 * 3) + (showHomeButton == true ? 36 : 0)) + 5;
    super.setBounds({ x, y: (TOOLBAR_HEIGHT + SEARCHBAR_HEIGHT), width: WIDTH, height: HEIGHT })
  }

  public async show() {
    await super.show();
    this.webContents.send('visible', true);
  }

  public send(siteContent: IContent) {  
    this.fixBounds(siteContent);
    this.webContents.send('content', siteContent);
  }

  private fixBounds(siteContent: IContent) {
    if(siteContent.type == "webui") {
      WIDTH = 322;
      HEIGHT = 54;

      siteContent.width = WIDTH - 42;
      siteContent.height = HEIGHT - 35;
    } else if(siteContent.type == "file") {
      WIDTH = 297
      HEIGHT = 245;

      siteContent.height = 240;
    } else {
      WIDTH = 334;
      HEIGHT = 365;

      siteContent.width = WIDTH - 42;
      siteContent.height = HEIGHT - 50;
    }

    this.rearrange()
  }
}