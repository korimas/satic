import {defineStore} from 'pinia';

interface Comment {
  comment: string;
  name: string;
}

export const useCommentStore = defineStore('comment', {
  state: () => ({
    Comments: {} as Record<string, Comment[]>
  }),

  actions: {
    addComment(reqID: string, comment: string, name: string) {
      if (!this.Comments[reqID]) {
        this.Comments[reqID] = [];
      }
      this.Comments[reqID].push({comment: comment, name: name});
    }
  }
});
