import { defineStore } from 'pinia'

import RolesTypes from '@Domain/Roles'
import IdeaMarketStatusTypes from '@Domain/MarketStatus'
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
      return async (role: RolesTypes, token: string) => {
        const currentServiceKey =
          role === 'INITIATOR' ? 'getAllInitiatorMarketIdeas' : 'fetchIdeasMarket'
        const response = await IdeasMarketService[currentServiceKey](token)

        if (response instanceof Error) {
          return response
        }

        this.ideasMarket = response
        return this.ideasMarket
      }
    },

    getMarketIdea() {
      return async (id: string, role: RolesTypes, token: string) => {
        const ideaMarket = await IdeasMarketService.getIdeaMarket(id, token)

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
            value: id,
          })
        }

        const ideasMarket = await this.getMarketIdeas(role, token)

        if (ideasMarket instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            ideasMarket.message,
          )
          return ideasMarket
        }

        return findOneAndUpdate(this.ideasMarket, ideaMarket, {
          key: 'id',
          value: id,
        })
      }
    },
  },

  actions: {
    async updateIdeaMarketStatus(
      id: string,
      status: IdeaMarketStatusTypes,
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
        const currentIdeaMarket = this.ideasMarket.find(
          (ideaMarket) => ideaMarket.id === id,
        )

        if (currentIdeaMarket) {
          currentIdeaMarket.status = status
        }
      }
    },

    async setIdeaMarketTeam(requestToIdea: RequestTeamToIdea, token: string) {
      const { ideaMarketId } = requestToIdea
      const response = await IdeasMarketService.postIdeaMarketTeam(
        requestToIdea,
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentIdeaMarket = this.ideasMarket.find(
          ({ id }) => id === ideaMarketId,
        )

        if (currentIdeaMarket) {
          currentIdeaMarket.team = response
        }
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
