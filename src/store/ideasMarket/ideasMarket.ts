import { defineStore } from 'pinia'
import InitialState from './initialState'

import RolesTypes from '@Domain/Roles'
import IdeasMarket from '@Domain/IdeasMarket'

import IdeasMarketService from '@Services/IdeasMarketService'

import useNotificationsStore from '@Store/notifications/notificationsStore'

const useIdeasMarketStore = defineStore('ideasMarket', {
  state: (): InitialState => ({
    ideas: [],
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

        this.ideas = response
        return this.ideas
      }
    },

    getMarketIdea() {
      return async (id: string, token: string) => {
        const response = await IdeasMarketService.getIdeaMarket(id, token)

        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
          return response
        }

        const existingIdeaIndex = this.ideas.findIndex((idea) => idea.id === id)

        if (existingIdeaIndex !== -1) {
          this.ideas.splice(existingIdeaIndex, 1, response)
        }

        return this.ideas[existingIdeaIndex] as IdeasMarket
      }
    },
  },
})

export default useIdeasMarketStore
