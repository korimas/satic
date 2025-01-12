import { defineStore } from 'pinia';
import { Project, SpecItem } from 'src/data/structs';
import { SpecTree } from 'src/service/spec';

export const useSpecStore = defineStore('spec', {
  state: () => ({
    curSpec: new SpecTree(),
    contentDetailVisible: false,
  }),

  actions: {
    setCurSpec(spec: SpecTree) {
      this.curSpec = spec;
    },
    getCurSpec() {
      return this.curSpec;
    },
  },
});
