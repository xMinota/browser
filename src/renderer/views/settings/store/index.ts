import { DEFAULT_PREFERENCES } from '~/shared/models/default-preferences';
import { observable, computed } from 'mobx';
import { getTheme } from '~/shared/utils/themes';

export type SettingsSection =
  | 'home'
  | 'id'
  | 'id.deleteAccount'
  | 'privacy'
  | 'privacy.moreOptions'
  | 'privacy.referrerOptions'
  | 'appearance'
  | 'search'
  | 'keychains'
  | 'languages'
  | 'downloads'
  | 'about';

class Store {
    @observable
    public conf: DEFAULT_PREFERENCES = { ...(window as any).settings };

    @computed
    public get theme() {
      return getTheme(this.conf.appearance.theme)
    }

    @observable
    public currentContent: SettingsSection = "home"

    @observable
    public previousContents: SettingsSection[] = ["home"];

    @observable
    public deleteAccountReadiness: boolean = false;

    @observable
    public searchItems: any[] = []

    public saveSettings(preferences: DEFAULT_PREFERENCES) {
      console.log("⚡ Saving settings...")

      this.conf = { ...this.conf, ...preferences };

      window.postMessage(
        {
          type: 'save-settings',
          data: { ...this.conf, ...preferences }
        },
        '*',
      );
    }

    constructor() {
      window.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll("[data-query]").forEach(el => {
          const data = el.getAttribute("data-query");
          const obj = JSON.parse(data);

          obj.parentSelector = el.parentElement.getAttribute("data-selector")

          this.searchItems.push(obj)
        })
      })

    }
}

export default new Store();