import { defineStore } from 'pinia';

class Drawer {
  show: boolean;
  alive: boolean;
  data: any;

  constructor() {
    this.show = false;
    this.alive = false;
    this.data = {};
  }

  public openDrawer() {
    this.alive = true;
    this.show = true;
  }

  public closeDrawer() {
    this.show = false;
  }

  public resetData() {
    this.data = {};
  }
}

export const useDrawerStore = defineStore('drawer', {
  state: () => ({
    CreateSpecDrawer: new Drawer(),
  }),
});
