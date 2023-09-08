import { defineStore } from 'pinia'

import InitialState from './initialState'
import IdeasService from '@Services/IdeasService'

const useIdeasStore = defineStore('ideas', {
  state: (): InitialState => ({
    ideas: [],
  }),
  actions: {
    async fetchIdeas(token: string) {
      this.ideas = await IdeasService.fetchIdeas(token)
    },
    async deleteInitiatorIdea(id: number, token: string) {
      await IdeasService.deleteInitiatorIdea(id, token)

      const deleteIdea = this.ideas.find((e) => e.id == id)
      if (deleteIdea) {
        const index = this.ideas.indexOf(deleteIdea)
        this.ideas.splice(index, 1)
      }
    },
  },
})

export default useIdeasStore
