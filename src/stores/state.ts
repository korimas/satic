import { get } from 'http';
import { defineStore } from 'pinia';

export interface Project {
  ID: string;
  name: string;
  desc: string;
  icon: string;
}

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
