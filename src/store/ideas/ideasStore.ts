import { defineStore } from 'pinia'
import { Idea } from '@Domain/Idea'
import { ExpertConfirmation } from '@Components/Modals/IdeaModal/ExpertRatingCalculator.types'
import InitialState from './initialState'
import IdeasService from '@Services/IdeasService'

const useIdeasStore = defineStore('ideas', {
  state: (): InitialState => ({
    ideas: [],
  }),
  actions: {
    async fetchIdeas(token: string) {
      const response = await IdeasService.fetchIdeas(token)

      if (response instanceof Error) {
        return
      }

      this.ideas = response
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
    async confirmInitatorIdea(
      rating: ExpertConfirmation,
      id: string,
      token: string,
      email: string,
    ) {
      const response = await IdeasService.putExpertIdea(rating, id, token)
      if (response instanceof Error) {
        return
      }
      this.ideas.forEach((idea: Idea) => {
        if (idea.id == id) {
          idea.confirmedBy = [...(idea.confirmedBy || []), email]
        }
      })
    },
  },
})

export default useIdeasStore
