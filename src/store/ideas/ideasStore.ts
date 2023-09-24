import { defineStore } from 'pinia'
import { Idea } from '@Domain/Idea'
import InitialState from './initialState'
import IdeasService from '@Services/IdeasService'
import getMockIdeas from '@Utils/getMockIdeas'
const useIdeasStore = defineStore('ideas', {
  state: (): InitialState => ({
    ideas: [],
  }),
  actions: {
    async fetchIdeas(token: string) {
      this.ideas = getMockIdeas()
    },
    async deleteInitiatorIdea(id: string, token: string) {
      await IdeasService.deleteInitiatorIdea(id, token)
      const deleteIdea = this.ideas.find((idea) => idea.id == id)
      if (deleteIdea) {
        const index = this.ideas.indexOf(deleteIdea)
        this.ideas.splice(index, 1)
      }
    },
    async sendInitiatorIdeaOnApproval(id: string, token: string) {
      await IdeasService.sendInitiatorIdeaOnApproval(id, token)
      this.ideas.forEach((idea: Idea) =>
        idea.id == id ? (idea.status = 'ON_APPROVAL') : idea,
      )
    },
  },
})
export default useIdeasStore
