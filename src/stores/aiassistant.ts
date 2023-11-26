import { defineStore } from 'pinia';

export const useAIAssistantStore = defineStore('assistant', {
  state: () => ({
    DisplayMessages: [],
    GPTMessages: [],
  }),
});
