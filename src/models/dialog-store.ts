import { ipcRenderer, remote } from 'electron';
import { observable, computed } from 'mobx';
import { DEFAULT_PREFERENCES_OBJECT, DEFAULT_PREFERENCES } from '~/shared/models/default-preferences';
import { getTheme } from '~/shared/utils/themes';

export class DialogStore {
  @observable
  public preferences: DEFAULT_PREFERENCES = DEFAULT_PREFERENCES_OBJECT;

  @computed
  public get theme() {
    return getTheme(this.preferences.appearance.theme);
  }

  @observable
  public visible = false;

  public firstTime = false;

  public constructor(
    options: {
      hideOnBlur?: boolean;
      visibilityWrapper?: boolean;
    } = {},
  ) {
    const { visibilityWrapper, hideOnBlur } = {
      hideOnBlur: true,
      visibilityWrapper: true,
      ...options,
    };
    if (visibilityWrapper) {
      ipcRenderer.on('visible', async (e, flag, ...args) => {
        if (!this.firstTime) {
          requestAnimationFrame(() => {
            this.visible = true;

            setTimeout(() => {
              this.visible = false;

              setTimeout(() => {
                this.onVisibilityChange(flag, ...args);
              }, 20);
            }, 20);
          });
          this.firstTime = true;
        } else {
          this.onVisibilityChange(flag, ...args);
        }
      });
    }

    if (hideOnBlur) {
      window.addEventListener('blur', () => {
        this.hide();
      });
    }

    ipcRenderer.send('get-settings');

    ipcRenderer.on('update-settings', (e, preferences: DEFAULT_PREFERENCES) => {
      this.preferences = { ...this.preferences, ...preferences };
    });
  }

  public get id() {
    return remote.getCurrentWebContents().id;
  }

  public get windowId() {
    return remote.getCurrentWindow().id;
  }

  public onVisibilityChange(visible: boolean, ...args: any[]) {}

  public hide(data: any = null) {
    if (this.visible) {
      this.visible = false;
      this.onHide(data);
      setTimeout(() => {
        ipcRenderer.send(`hide-${this.id}`);
      });
    }
  }

  public onHide(data: any = null) {}
}
