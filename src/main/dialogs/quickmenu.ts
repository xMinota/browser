import { AppWindow } from '../app-window';
import { Dialog } from './dialog';
import { Rectangle } from 'electron';

const WIDTH = 300;
const HEIGHT = 350;

export class QuickMenuDialog extends Dialog {
  public visible = false;

  constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'quickmenu',
      bounds: {
        width: WIDTH,
        height: HEIGHT,
        y: 0,
      },
      devtools: false
    });

    ipcMain.on(`show-${this.webContents.id}`, () => {
      this.show();
    });
  }

  public setPos(x: number, y: number) {
    super.rearrange({ x, y });
  }
}