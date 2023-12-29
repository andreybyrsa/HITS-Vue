import { defineStore } from 'pinia'

import { RequestTeamToIdea, RequestToIdeaStatus } from '@Domain/RequestTeamToIdea'
import { Team } from '@Domain/Team'

import TeamService from '@Services/TeamService'
import RequestToIdeaService from '@Services/RequestToIdeaService'

import useNotificationsStore from '@Store/notifications/notificationsStore'
import InitialState from '@Store/requestsToIdea/initialState'
import useIdeasMarketStore from '@Store/ideasMarket/ideasMarket'

const useRequestsToIdeaStore = defineStore('requestsToIdea', {
  state: (): InitialState => ({
    requests: [],
    requestsTeamsToIdea: [],
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
    getTeamRequestsToIdeas() {
      return async (teamId: string, token: string) => {
        const response = await TeamService.getTeamRequestsToIdeas(teamId, token)

        if (response instanceof Error) {
          return response
        }

        this.requestsTeamsToIdea = response
        return this.requestsTeamsToIdea
      }
    },
  },
  actions: {
    async postRequest(
      team: Team,
      ideaId: string,
      marketId: string,
      letter: string,
      token: string,
    ) {
      const requestTeam = {
        teamId: team.id,
        ideaMarketId: ideaId,
        marketId: marketId,

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

    async acceptRequestToIdea(requestToIdea: RequestTeamToIdea, token: string) {
      const { id, ideaMarketId, teamId } = requestToIdea
      const ideasMarketStore = useIdeasMarketStore()

      const responseAcceptRequest =
        await RequestToIdeaService.acceptRequestToIdeaStatus(
          ideaMarketId,
          teamId,
          token,
        )
      if (responseAcceptRequest instanceof Error) {
        useNotificationsStore().createSystemNotification(
          'Система',
          responseAcceptRequest.message,
        )
      } else {
        const currentRequestToIdea = this.requests.find(
          (request) => request.id === id,
        )
        if (currentRequestToIdea) {
          currentRequestToIdea.status = 'ACCEPTED'
        }

        const ideaMarket = ideasMarketStore.ideasMarket.find(
          (idea) => idea.id === ideaMarketId,
        )
        if (ideaMarket) {
          ideaMarket.status = 'RECRUITMENT_IS_CLOSED'
          ideaMarket.team = responseAcceptRequest
        }
      }

      const response = RequestToIdeaService.updateRequestToIdeaStatus(
        id,
        'ACCEPTED',
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      }
    },

    async updateRequestToIdea(
      requestId: string,
      status: RequestToIdeaStatus,
      token: string,
    ) {
      const response = await RequestToIdeaService.updateRequestToIdeaStatus(
        requestId,
        status,
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentRequestToIdea = this.requests.find(
          (request) => request.id === requestId,
        )

        if (currentRequestToIdea) {
          currentRequestToIdea.status = status
        }
      }
    },
  },
})

export default useRequestsToIdeaStore
