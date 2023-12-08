import { defineStore } from 'pinia'

import InitialState from '@Store/requestsToIdea/initialState'

import RequestToIdeaService from '@Services/RequestToIdeaService'

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
})

export default useRequestsToIdeaStore
