import { defineStore } from 'pinia'

import { RequestTeamToIdea, RequestToIdeaStatus } from '@Domain/RequestTeamToIdea'

import RequestToIdeaService from '@Services/RequestToIdeaService'
import { Team } from '@Domain/Team'
import useNotificationsStore from '@Store/notifications/notificationsStore'

import InitialState from '@Store/requestsToIdea/initialState'
import useIdeasMarketStore from '@Store/ideasMarket/ideasMarket'
import { makeParallelRequests } from '@Utils/makeParallelRequests'
import Success from '@Domain/ResponseMessage'
import useTeamStore from '@Store/teams/teamsStore'

const ideasMarketStore = useIdeasMarketStore()
const teamStore = useTeamStore()

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

    async acceptRequestToIdea(requestToIdea: RequestTeamToIdea, token: string) {
      const { id, ideaMarketId, teamId } = requestToIdea

      const parallelRequests = [
        () =>
          RequestToIdeaService.acceptRequestToIdeaStatus(
            ideaMarketId,
            teamId,
            token,
          ),
        () => RequestToIdeaService.updateRequestToIdeaStatus(id, 'ACCEPTED', token),
      ]

      await makeParallelRequests<Error | Success | void | RequestTeamToIdea[]>(
        parallelRequests,
      )

      const currentRequestToIdea = this.requests.find((request) => request.id === id)
      if (currentRequestToIdea) {
        currentRequestToIdea.status = 'ACCEPTED'
      }

      const team = teamStore.$state.teams.find((team) => team.id === teamId)
      const ideaMarket = ideasMarketStore.$state.ideasMarket.find(
        (idea) => idea.id === ideaMarketId,
      )
      if (ideaMarket && team) {
        ideaMarket.status = 'RECRUITMENT_IS_CLOSED'
        ideaMarket.team = team
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
