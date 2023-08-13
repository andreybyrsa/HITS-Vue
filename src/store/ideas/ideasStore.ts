import { defineStore } from 'pinia'
import InitialState from './initialState'

import IdeasService from '@Services/IdeasService'
import { Idea } from '@Domain/Idea'

const useIdeasStore = defineStore('ideas', {
  state: (): InitialState => ({
    ideas: [],
    initiatorIdeas: [],
  }),
  actions: {
    async fetchIdeas(token: string) {
      this.ideas = await IdeasService.getAdminIdeas(token)
      this.initiatorIdeas = await IdeasService.getInitiatorIdeas(token)
    },
    async postInitiatorIdeas(idea: Idea, token: string) {
      await IdeasService.postInitiatorIdeas(idea, token)
      this.initiatorIdeas = await IdeasService.getInitiatorIdeas(token)
    },
    async getInitiatorIdeas(token: string) {
      await IdeasService.getInitiatorIdeas(token)
    },
    async deleteInitiatorIdeas(id: number, token: string) {
      await IdeasService.deleteInitiatorIdeas(id, token)
      this.ideas = await IdeasService.getAdminIdeas(token)
      this.initiatorIdeas = await IdeasService.getInitiatorIdeas(token)
    },
  },
})

export default useIdeasStore
