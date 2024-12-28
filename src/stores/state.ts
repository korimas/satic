import { defineStore } from 'pinia';
import { Project, SpecItem } from 'src/data/structs';
import { SpecTree } from 'src/service/spec';

interface State {
  curProject: Project;
  curSpec: SpecTree;
}

export const useStateStore = defineStore('state', {
  state: () => ({
    State: {} as State,
  }),

  actions: {
    setCurProject(project: Project) {
      this.State.curProject = project;
    },
    getCurProject() {
      return this.State.curProject;
    },
  },
});
