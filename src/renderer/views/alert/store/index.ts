import { DialogStore } from '~/models/dialog-store';

export class Store extends DialogStore {
  public constructor() {
    super();
  }

  public onVisibilityChange(visible: boolean) {
    this.visible = visible;
  }
}

export default new Store();
