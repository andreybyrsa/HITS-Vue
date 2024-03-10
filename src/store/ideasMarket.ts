import { defineStore } from 'pinia'
import {
  IdeaMarket,
  RolesTypes,
  RequestTeamToIdea,
  IdeaMarketStatusType,
  Team,
} from '@Domain'
import { IdeaMarketService } from '@Service'
import { useNotification } from '@Hooks'
import { findOneAndUpdate } from '@Utils'

interface InitialState {
  ideasMarket: IdeaMarket[]
}

export const useIdeasMarketStore = defineStore('ideasMarket', {
  state: (): InitialState => ({
    ideasMarket: [],
  }),

  getters: {
    getMarketIdeas() {
      return async (marketId: string, role: RolesTypes) => {
        const currentServiceKey =
          role === 'INITIATOR' ? 'getAllInitiatorMarketIdeas' : 'fetchIdeasMarket'

        const response = await IdeaMarketService[currentServiceKey](marketId)

        if (response instanceof Error) {
          return response
        }

        this.ideasMarket = response
        return this.ideasMarket
      }
    },

    getMarketIdea() {
      return async (marketId: string, role: RolesTypes) => {
        const ideaMarket = await IdeaMarketService.getIdeaMarket(marketId)

        if (ideaMarket instanceof Error) {
          useNotification('Система', ideaMarket.message)
          return ideaMarket
        }

        if (this.ideasMarket.length) {
          return findOneAndUpdate(this.ideasMarket, ideaMarket, {
            key: 'id',
            value: marketId,
          })
        }

        const ideasMarket = await this.getMarketIdeas(marketId, role)

        if (ideasMarket instanceof Error) {
          useNotification('Система', ideasMarket.message)
          return ideasMarket
        }

        return findOneAndUpdate(this.ideasMarket, ideaMarket, {
          key: 'id',
          value: marketId,
        })
      }
    },

    getAllInitiatorMarketIdeasByUserId() {
      return async (userId: string) => {
        const response = await IdeaMarketService.getAllInitiatorMarketIdeasByUserId(
          userId,
        )

        if (response instanceof Error) {
          useNotification('Система', response.message)
          return response
        }

        this.ideasMarket = response
        return this.ideasMarket
      }
    },
  },

  actions: {
    async updateIdeaMarketStatus(id: string, status: IdeaMarketStatusType) {
      const response = await IdeaMarketService.updateIdeaMarketStatus(id, status)

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }

      this.ideasMarket.map((idea) => {
        if (idea.id === id) {
          idea.status = status
        }
      })
    },

    async setIdeaMarketTeam(requestToIdea: RequestTeamToIdea) {
      const { ideaMarketId } = requestToIdea
      const response = await IdeaMarketService.postIdeaMarketTeam(
        ideaMarketId,
        requestToIdea,
      )

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }

      this.ideasMarket.map((idea) => {
        if (idea.id === ideaMarketId) {
          idea.team = response.team
        }
      })
    },

    async addIdeaMarketTeam(ideaMarketId: string, team: Team) {
      const response = await IdeaMarketService.addIdeaMarketTeam(ideaMarketId, team)

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }

      this.ideasMarket.map((idea) => {
        if (idea.id === ideaMarketId) {
          idea.team = team
        }
      })
    },

    async kickTeamFromIdeaMarket(ideaMarketId: string) {
      const response = await IdeaMarketService.kickTeamFromIdeaMarket(ideaMarketId)

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }

      const currentIdeaMarket = this.ideasMarket.find(
        ({ id }) => id === ideaMarketId,
      )

      if (currentIdeaMarket) {
        currentIdeaMarket.team = null
      }
    },
  },
})
