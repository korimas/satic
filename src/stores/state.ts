import { defineStore } from 'pinia';
import { Project } from 'src/data/structs';

interface State {
  curProject: Project;
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
