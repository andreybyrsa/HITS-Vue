import { defineStore } from 'pinia'
import { RequestToTeam, JoinStatus } from '@Domain'
import { useTeamStore } from '@Store'
import { useNotification } from '@Hooks'
import { TeamService } from '@Service'

interface InitialState {
  requests: RequestToTeam[]
}

export const useRequestsToTeamStore = defineStore('requestsToTeam', {
  state: (): InitialState => ({
    requests: [],
  }),

  getters: {
    getRequestsToTeam() {
      return async (teamId: string) => {
        const response = await TeamService.getRequestsToTeam(teamId)

        if (response instanceof Error) {
          return response
        }

        this.requests = response
        return this.requests
      }
    },
  },

  actions: {
    async sendRequestInTeam(requestToTeam: RequestToTeam) {
      const response = await TeamService.createRequestToTeam(requestToTeam)

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }

      this.requests.push(response)
    },

    async updateRequestToTeamStatus(
      requestToTeam: RequestToTeam,
      status: JoinStatus,
    ) {
      const { id, userId, teamId } = requestToTeam

      const response = await TeamService.updateRequestToTeamStatus(
        id,
        teamId,
        userId,
        status,
      )

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }

      const currentRequestToTeam = this.requests.find((request) => request.id === id)

      if (currentRequestToTeam) {
        currentRequestToTeam.status = status
      }

      if (status === 'ACCEPTED') {
        const teamsStore = useTeamStore()

        await teamsStore.addTeamMember({ ...requestToTeam, skills: [] })
      }
    },
  },
})
