import { defineStore } from 'pinia'
import { Idea, IdeaStatusType, RolesTypes } from '@Domain'
import { useNotification } from '@Hooks'
import { IdeaService } from '@Service'
import { findOneAndUpdate } from '@Utils'

interface InitialState {
  ideas: Idea[]
}

export const useIdeasStore = defineStore('ideas', {
  state: (): InitialState => ({
    ideas: [],
  }),

  getters: {
    getIdeas() {
      return async (role: RolesTypes) => {
        const currentIdeaServiceKey =
          role === 'INITIATOR' ? 'getAllInitiator' : 'getAll'

        const response = await IdeaService[currentIdeaServiceKey]()

        if (response instanceof Error) {
          useNotification('Система', response.message)
          return response
        }

        this.ideas = response
        return this.ideas
      }
    },

    getExpertNotConfirmedIdeas() {
      return async () => {
        const response = await IdeaService.getAllOnConfirmation()

        if (response instanceof Error) {
          useNotification('Система', response.message)
          return response
        }

        this.ideas = response
        return this.ideas
      }
    },

    getIdea() {
      return async (id: string, role: RolesTypes) => {
        const currentIdeaServiceKey = role === 'INITIATOR' ? 'getInitiator' : 'get'

        const idea = await IdeaService[currentIdeaServiceKey](id)

        if (idea instanceof Error) {
          return idea
        }

        if (this.ideas.length) {
          return findOneAndUpdate(this.ideas, idea, { key: 'id', value: id })
        }

        const ideas = await this.getIdeas(role)

        if (ideas instanceof Error) {
          return ideas
        }

        return findOneAndUpdate(this.ideas, idea, { key: 'id', value: id })
      }
    },
  },

  actions: {
    async updateIdeaStatus(id: string, status: IdeaStatusType, role: RolesTypes) {
      const currentIdeaServiceKey = role === 'INITIATOR' ? 'send' : 'updateStatus'
      const response = await IdeaService[currentIdeaServiceKey](id, status)

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }

      const currentIdea = this.ideas.find((idea) => idea.id === id)

      if (currentIdea) {
        currentIdea.status = status
      }
    },

    changeIdeasStatusOnMarket(merketIdeas: Idea[]) {
      merketIdeas.forEach((marketIdea) => {
        const ideaStore = this.ideas.find(({ id }) => id === marketIdea.id)

        if (ideaStore) {
          ideaStore.status = 'ON_MARKET'
        }
      })
    },

    setIdeaRating(id: string, rating: number) {
      const currentIdea = this.ideas.find((idea) => idea.id === id)

      if (currentIdea) {
        currentIdea.rating = rating
        currentIdea.status = 'CONFIRMED'
      }
    },

    async deleteIdea(id: string) {
      const response = await IdeaService.remove(id)

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }

      const deletingIdeaIndex = this.ideas.findIndex((idea) => idea.id === id)

      if (deletingIdeaIndex !== -1) {
        this.ideas.splice(deletingIdeaIndex, 1)
      }
    },

    checkIdea(id: string) {
      const currentIdea = this.ideas.find((idea) => idea.id === id)

      if (currentIdea) currentIdea.isChecked = true
    },
  },
})
