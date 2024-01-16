import { defineStore } from 'pinia'

import { RequestToTeam, JoinStatus } from '@Domain/Team'

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
    async sendRequestInTeam(requestToTeam: RequestToTeam, token: string) {
      const response = await TeamService.createRequestToTeam(requestToTeam, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        this.requests.push(response)
      }
    },

    async updateRequestToTeamStatus(
      requestToTeam: RequestToTeam,
      status: JoinStatus,
      token: string,
    ) {
      const { id, userId } = requestToTeam
      const response = await TeamService.updateRequestToTeamStatus(
        id,
        userId,
        status,
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentRequestToTeam = this.requests.find(
          (request) => request.id === id,
        )

        if (currentRequestToTeam) {
          currentRequestToTeam.status = status
        }

        if (status === 'ACCEPTED') {
          const teamsStore = useTeamStore()
          await teamsStore.addTeamMember(
            { ...requestToTeam, skills: [], projectStatus: 'NOTACTIVE' },
            token,
          )
        }
      }
    },
  },
})

export default useRequestsToTeamStore
