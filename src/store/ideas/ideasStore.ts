import { defineStore } from 'pinia'
import InitialState from './initialState'

import { Idea } from '@Domain/Idea'

import IdeasService from '@Services/IdeasService'

const useIdeasStore = defineStore('ideas', {
  state: (): InitialState => ({
    ideas: [],
  }),
  actions: {
    async fetchIdeas(token: string) {
      const response = await IdeasService.getIdeas(token)

      if (response instanceof Error) {
        return
      }

      this.ideas = response
    },
    async deleteInitiatorIdea(id: string, token: string) {
      const response = await IdeasService.deleteIdea(id, token)

      if (response instanceof Error) {
        return
      }

      const deleteIdea = this.ideas.find((idea) => idea.id == id)
      if (deleteIdea) {
        const index = this.ideas.indexOf(deleteIdea)
        this.ideas.splice(index, 1)
      }
    },
    async sendInitiatorIdeaOnApproval(id: string, token: string) {
      await IdeasService.sendIdeaOnApproval(id, token)
      this.ideas.forEach((idea: Idea) =>
        idea.id == id ? (idea.status = 'ON_APPROVAL') : idea,
      )
    },
    async updateIdeaByAdmin(idea: Idea, id: string, token: string) {
      await IdeasService.updateIdea(idea, id, token)
      this.ideas.forEach((idea: Idea) =>
        idea.id == id ? (idea.status = 'ON_APPROVAL') : idea,
      )
    },
  },
})
export default useIdeasStore
