import {defineStore} from 'pinia';

interface Comment {
  comment: string;
  name: string;
}

interface RequirementComments {
  requirementID: string;
  requirementDesc: string;
  comments: Comment[];
}

export const useCommentStore = defineStore('comment', {
  state: () => ({
    Comments: {} as Record<string, RequirementComments>
  }),

  actions: {
    addComment(reqID: string, comment: string, name: string, reqDescription: string) {
      if (!this.Comments[reqID]) {
        this.Comments[reqID] = {
          requirementID: reqID,
          requirementDesc: reqDescription,
          comments: []
        };
      }
      this.Comments[reqID]['comments'].push({comment: comment, name: name});
    }
  }
});
