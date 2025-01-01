import { defineStore } from 'pinia';
import { Project } from 'src/data/structs';

interface State {
  curProject: Project;
  sideMenuShow: boolean;
}

export const useStateStore = defineStore('state', {
  state: () => ({
    State: {} as State,
    sideMenuShow: true,
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
