import { defineStore } from 'pinia'

import { RequestTeamToIdea } from '@Domain/RequestTeamToIdea'

import RequestToIdeaService from '@Services/RequestToIdeaService'

import InitialState from '@Store/requestsToIdea/initialState'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import useIdeasMarketStore from '@Store/ideasMarket/ideasMarket'

const useRequestsToIdeaStore = defineStore('requestsToIdea', {
  state: (): InitialState => ({
    requests: [],
  }),

  getters: {
    getRequestsToIdea() {
      return async (ideaId: string, token: string) => {
        const response = await RequestToIdeaService.getIdeaRequests(ideaId, token)

        if (response instanceof Error) {
          return response
        }

        this.requests = response
        return this.requests
      }
    },
  },

  actions: {
    async acceptRequestToIdea(requestToIdea: RequestTeamToIdea, token: string) {
      const { id } = requestToIdea
      const response = await RequestToIdeaService.updateRequestToIdeaStatus(
        id,
        'ACCEPTED',
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentRequestToIdea = this.requests.find(
          (request) => request.id === id,
        )

        if (currentRequestToIdea) {
          currentRequestToIdea.status = 'ACCEPTED'
        }

        const ideasMarketStore = useIdeasMarketStore()
        await ideasMarketStore.setIdeaMarketTeam(requestToIdea, token)
      }
    },

    async cancelRequestToIdea(requestToIdea: RequestTeamToIdea, token: string) {
      const { id } = requestToIdea
      const response = await RequestToIdeaService.updateRequestToIdeaStatus(
        id,
        'CANCELLED',
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentRequestToIdea = this.requests.find(
          (request) => request.id === id,
        )

        if (currentRequestToIdea) {
          currentRequestToIdea.status = 'CANCELLED'
        }
      }
    },
  },
})

export default useRequestsToIdeaStore
