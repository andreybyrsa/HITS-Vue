import { defineStore } from 'pinia'

import { RequestTeamToIdea, RequestToIdeaStatus } from '@Domain/RequestTeamToIdea'
import { Team } from '@Domain/Team'

import TeamService from '@Services/TeamService'
import RequestToIdeaService from '@Services/RequestToIdeaService'

import useNotificationsStore from '@Store/notifications/notificationsStore'
import InitialState from '@Store/requestsToIdea/initialState'
import useIdeasMarketStore from '@Store/ideasMarket/ideasMarket'
import useInvitationsTeamToIdeaStore from '@Store/invitationTeamToIdea/invitationTeamToIdeaStore'

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
      const invitationsTeamToIdeaStore = useInvitationsTeamToIdeaStore()

      const response = await RequestToIdeaService.acceptRequestToIdea(
        id,
        ideaMarketId,
        teamId,
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        this.requests.forEach(
          (request) =>
            (request.id === id && (request.status = 'ACCEPTED')) ||
            ((request.teamId === teamId ||
              (request.ideaMarketId === ideaMarketId && request.status === 'NEW')) &&
              (request.status = 'ANNULLED')),
        )

        const currentIdeaMarket = ideasMarketStore.ideasMarket.find(
          (idea) => idea.id === ideaMarketId,
        )
        const currentsInvitationNew =
          invitationsTeamToIdeaStore.ideaInvitations.filter(
            ({ status, ideaMarketId: checkIdeaMarketId }) =>
              status === 'NEW' && checkIdeaMarketId === ideaMarketId,
          )

        if (currentIdeaMarket && currentsInvitationNew) {
          currentIdeaMarket.status = 'RECRUITMENT_IS_CLOSED'
          currentIdeaMarket.team = response

          currentsInvitationNew.forEach(
            (invitation) => (invitation.status = 'ANNULLED'),
          )
        }
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
