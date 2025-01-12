import { defineStore } from 'pinia';
import { SpecItem } from 'src/data/structs';

class DrawerMode {
  show: boolean;
  alive: boolean;
  data: any;

  constructor() {
    this.show = false;
    this.alive = false;
    this.data = {};
  }

  public openDrawer(data: any = {}) {
    this.data = data;
    this.alive = true;
    this.show = true;
  }

  public closeDrawer() {
    this.show = false;
    this.clearData();
  }

  public clearData() {
    this.data = {};
  }
}

class DetailSpecDrawerModel extends DrawerMode {
  currentTab: string;

  constructor() {
    super();
    this.currentTab = 'comment';
  }

  public openDrawer(data: SpecItem) {
    this.data = data;
    this.alive = true;
    this.show = true;
  }

  public clearData(): void {
    console.log('DetailSpecDrawerModel clearData');
    this.data.isInEdit = false;
    this.data.edit_content = '';
    this.data.edit_summary = '';
    this.currentTab = 'comment';
  }
}

export const useDrawerStore = defineStore('drawer', {
  state: () => ({
    CreateSpecDrawer: new DrawerMode(),
    DetailSpecDrawer: new DetailSpecDrawerModel(),
  }),
});
