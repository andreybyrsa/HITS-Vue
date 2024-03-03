import { defineStore } from 'pinia'
import { RequestTeamToIdea, RequestToIdeaStatus, Team } from '@Domain'
import { useIdeasMarketStore, useInvitationsTeamToIdeaStore } from '@Store'
import { useNotification } from '@Hooks'
import { TeamService, RequestToIdeaService } from '@Service'

interface InitialState {
  requests: RequestTeamToIdea[]
  requestsTeamsToIdea: RequestTeamToIdea[]
}

export const useRequestsToIdeaStore = defineStore('requestsToIdea', {
  state: (): InitialState => ({
    requests: [],
    requestsTeamsToIdea: [],
  }),

  getters: {
    getRequestsToIdea() {
      return async (ideaId: string) => {
        const response = await RequestToIdeaService.getIdeaRequests(ideaId)

        if (response instanceof Error) {
          return response
        }

        this.requests = response
        return this.requests
      }
    },

    getTeamRequestsToIdeas() {
      return async (teamId: string) => {
        const response = await TeamService.getTeamRequestsToIdeas(teamId)

        if (response instanceof Error) {
          return response
        }

        this.requestsTeamsToIdea = response
        return this.requestsTeamsToIdea
      }
    },
  },

  actions: {
    async postRequest(team: Team, ideaId: string, marketId: string, letter: string) {
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

      const response = await RequestToIdeaService.postRequest(requestTeam)

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }

      this.requests.push(response)
    },

    async acceptRequestToIdea(requestToIdea: RequestTeamToIdea) {
      const { id, ideaMarketId, teamId } = requestToIdea
      const ideasMarketStore = useIdeasMarketStore()

      const response = await RequestToIdeaService.acceptRequestToIdeaStatus(
        ideaMarketId,
        teamId,
      )

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }

      const currentRequestToIdea = this.requests.find((request) => request.id === id)

      if (currentRequestToIdea) {
        currentRequestToIdea.status = 'ACCEPTED'
      }

      const ideaMarket = ideasMarketStore.ideasMarket.find(
        (idea) => idea.id === ideaMarketId,
      )

      if (ideaMarket) {
        ideaMarket.status = 'RECRUITMENT_IS_CLOSED'
        ideaMarket.team = response
      }
    },

    async updateRequestToIdea(
      requestId: string,
      status: RequestToIdeaStatus,
      ideaId?: string,
      teamId?: string,
      ideaMarketId?: string,
    ) {
      const invitationStoreToIdea = useInvitationsTeamToIdeaStore()
      const response = await RequestToIdeaService.updateRequestToIdeaStatus(
        requestId,
        status,
      )

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }

      const currentRequestToIdea = this.requests.find(
        (request) => request.id === requestId,
      )

      if (currentRequestToIdea) {
        currentRequestToIdea.status = status
      }

      if (status === 'ACCEPTED') {
        this.requests.forEach((request) => {
          if (
            (request.ideaMarketId === ideaMarketId || request.teamId === teamId) &&
            request.status === 'NEW'
          )
            request.status = 'ANNULLED'
        })

        invitationStoreToIdea.ideaInvitations.forEach((invitation) => {
          if (
            (invitation.ideaId === ideaId || invitation.teamId === teamId) &&
            invitation.status === 'NEW'
          )
            invitation.status = 'ANNULLED'
        })
      }
    },
  },
})
