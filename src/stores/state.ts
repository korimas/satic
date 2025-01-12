import { defineStore } from 'pinia';
import { Project } from 'src/data/structs';

interface State {
  curProject: Project;
  sideMenuShow: boolean;
  // specCrateDrawerShow: boolean
}

export const useStateStore = defineStore('state', {
  state: () => ({
    State: {
      curProject: {} as Project,
      sideMenuShow: false,
      // specCrateDrawerShow: false
    } as State
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
