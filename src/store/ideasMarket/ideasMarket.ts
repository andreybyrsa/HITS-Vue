import { defineStore } from 'pinia'

import RolesTypes from '@Domain/Roles'
import { IdeaMarketStatusType } from '@Domain/IdeaMarket'
import { RequestTeamToIdea } from '@Domain/RequestTeamToIdea'

import IdeasMarketService from '@Services/IdeasMarketService'

import InitialState from '@Store/ideasMarket/initialState'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import findOneAndUpdate from '@Utils/findOneAndUpdate'

const useIdeasMarketStore = defineStore('ideasMarket', {
  state: (): InitialState => ({
    ideasMarket: [],
  }),

  getters: {
    getMarketIdeas() {
      return async (marketId: string, role: RolesTypes, token: string) => {
        const currentServiceKey =
          role === 'INITIATOR' ? 'getAllInitiatorMarketIdeas' : 'fetchIdeasMarket'

        const response = await IdeasMarketService[currentServiceKey](marketId, token)

        if (response instanceof Error) {
          return response
        }

        this.ideasMarket = response
        return this.ideasMarket
      }
    },

    getMarketIdea() {
      return async (marketId: string, role: RolesTypes, token: string) => {
        const ideaMarket = await IdeasMarketService.getIdeaMarket(marketId, token)

        if (ideaMarket instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            ideaMarket.message,
          )
          return ideaMarket
        }

        if (this.ideasMarket.length) {
          return findOneAndUpdate(this.ideasMarket, ideaMarket, {
            key: 'id',
            value: marketId,
          })
        }

        const ideasMarket = await this.getMarketIdeas(marketId, role, token)

        if (ideasMarket instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            ideasMarket.message,
          )
          return ideasMarket
        }

        return findOneAndUpdate(this.ideasMarket, ideaMarket, {
          key: 'id',
          value: marketId,
        })
      }
    },
    getAllInitiatorIdeasFromActiveMarkets() {
      return async (userId: string, token: string) => {
        const ideas = await IdeasMarketService.getAllInitiatorIdeasFromActiveMarkets(
          userId,
          token,
        )

        if (ideas instanceof Error) {
          useNotificationsStore().createSystemNotification('Система', ideas.message)
          return ideas
        }
        return ideas
      }
    },
  },

  actions: {
    async updateIdeaMarketStatus(
      id: string,
      status: IdeaMarketStatusType,
      token: string,
    ) {
      const response = await IdeasMarketService.updateIdeaMarketStatus(
        id,
        status,
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        this.ideasMarket.map((idea) => {
          if (idea.id === id) {
            idea.status = status
          }
        })
      }
    },

    async setIdeaMarketTeam(requestToIdea: RequestTeamToIdea, token: string) {
      const { ideaMarketId } = requestToIdea
      const response = await IdeasMarketService.postIdeaMarketTeam(
        ideaMarketId,
        requestToIdea,
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        this.ideasMarket.map((idea) => {
          if (idea.id === ideaMarketId) {
            idea.team = response.team
          }
        })
      }
    },

    async kickTeamFromIdeaMarket(ideaMarketId: string, token: string) {
      const response = await IdeasMarketService.kickTeamFromIdeaMarket(
        ideaMarketId,
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentIdeaMarket = this.ideasMarket.find(
          ({ id }) => id === ideaMarketId,
        )

        if (currentIdeaMarket) {
          currentIdeaMarket.team = null
        }
      }
    },
  },
})

export default useIdeasMarketStore
