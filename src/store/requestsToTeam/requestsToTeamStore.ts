import { defineStore } from 'pinia'

import { RequestToTeam } from '@Domain/Team'

import InitialState from '@Store/requestsToTeam/initialState'
import TeamService from '@Services/TeamService'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import useTeamStore from '@Store/teams/teamsStore'

const useRequestsToTeamStore = defineStore('requestsToTeam', {
  state: (): InitialState => ({
    requests: [],
  }),

  getters: {
    getRequestsToTeam() {
      return async (teamId: string, token: string) => {
        const response = await TeamService.getRequestsToTeam(teamId, token)

        if (response instanceof Error) {
          return response
        }

        this.requests = response
        return this.requests
      }
    },
  },

  actions: {
    async sendRequestInTeam(userId: string, teamId: string, token: string) {
      const response = await TeamService.sendRequestInTeam(userId, teamId, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        this.requests.push(response)
      }
    },

    async acceptRequestToTeam(requestToTeam: RequestToTeam, token: string) {
      const { id } = requestToTeam
      const response = await TeamService.updateRequestToTeamStatus(
        id,
        'ACCEPTED',
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentRequestToTeam = this.requests.find(
          (request) => request.id === id,
        )

        if (currentRequestToTeam) {
          currentRequestToTeam.status = 'ACCEPTED'
        }

        const teamsStore = useTeamStore()
        await teamsStore.addTeamMember({ ...requestToTeam, skills: [] }, token)
      }
    },

    async cancelRequestToTeam(requestToTeam: RequestToTeam, token: string) {
      const { id, teamId, userId } = requestToTeam
      const response = await TeamService.updateRequestToTeamStatus(
        id,
        'CANCELED',
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentRequestToTeam = this.requests.find(
          (request) => request.id === id,
        )
        if (currentRequestToTeam?.status === 'ACCEPTED') {
          currentRequestToTeam.status = 'CANCELED'

          const teamsStore = useTeamStore()
          await teamsStore.kickTeamMember(teamId, userId, token)
        } else if (currentRequestToTeam?.status === 'NEW') {
          currentRequestToTeam.status = 'CANCELED'
        }
      }
    },
  },
})

export default useRequestsToTeamStore
