import { defineStore } from 'pinia'

import InitialState from '@Store/requestsToIdea/initialState'

import RequestToIdeaService from '@Services/RequestToIdeaService'
import { Team } from '@Domain/Team'
import RequestTeamToIdea from '@Domain/RequestTeamToIdea'
import useNotificationsStore from '@Store/notifications/notificationsStore'

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
    async postRequest(team: Team, ideaId: string, letter: string, token: string) {
      const requestTeam = {
        teamId: team.id,
        ideaMarketId: ideaId,

        name: team.name,
        status: 'NEW',
        membersCount: team.membersCount,
        skills: team.skills,

        letter: letter,
      } as RequestTeamToIdea

      const response = await RequestToIdeaService.postRequest(requestTeam, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        this.requests.push(response)
      }
    },

    async changeStatusRequestToTeam(
      teamMarketId: string,
      status: string,
      token: string,
    ) {
      const response = await RequestToIdeaService.changeStatusRequest(
        teamMarketId,
        status,
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentTeam = this.requests.find(
          (request) => request.id === teamMarketId,
        )
        console.log(currentTeam)
        if (currentTeam) {
          currentTeam.status = 'CANCELED'
        }
      }
    },
  },
})

export default useRequestsToIdeaStore
