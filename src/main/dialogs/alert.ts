import { AppWindow } from '../app-window';
import { Dialog } from './dialog';
import { ipcMain } from 'electron';

const WIDTH = 500;
const HEIGHT = 200;

export class AlertDialog extends Dialog {
  public visible = false;
  public content: any = '';
  public action: 'alert' | 'confirm' | 'input';

  constructor(appWindow: AppWindow) {
    super(appWindow, {
      name: 'alert',
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
    super.setBounds({ x, y: 36, width: WIDTH, height: HEIGHT })
  }

  public send(content?: any) {
    this.webContents.send('content', this.action, content);
  }
}