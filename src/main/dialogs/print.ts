import { AppWindow } from '../app-window';
import { Dialog } from './dialog';
import { ipcMain } from 'electron';

const WIDTH = 1000;
const HEIGHT = 700;

export class PrintDialog extends Dialog {
  public visible = false;

  constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'print',
      bounds: {
        width: WIDTH,
        height: HEIGHT,
        y: 36,
      },
      devtools: false
    });

    ipcMain.on(`show-${this.webContents.id}`, () => {
      this.show();
    });
  }

  public rearrange() {
    const { width } = this.appWindow.getContentBounds();
    var x = Math.round(((width - WIDTH) / 2));
    super.rearrange({ x });
  }
}