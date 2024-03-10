import { defineStore } from 'pinia'
import { TeamInvitation, JoinStatus } from '@Domain'
import { useTeamStore } from '@Store'
import { useNotification } from '@Hooks'
import { TeamService } from '@Service'

interface InitialState {
  invitationUsers: TeamInvitation[]
}

export const useInvitationUsersStore = defineStore('invitationUsers', {
  state: (): InitialState => ({
    invitationUsers: [],
  }),

  getters: {
    getInvitationUsers() {
      return async (teamId: string) => {
        const response = await TeamService.getTeamInvitations(teamId)

        if (response instanceof Error) {
          useNotification('Система', response.message)
          return response
        }

        this.invitationUsers = response
        return this.invitationUsers
      }
    },
  },

  actions: {
    async inviteUsers(invitationsToTeam: TeamInvitation[]) {
      const response = await TeamService.createInvitationsToTeam(invitationsToTeam)

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }

      this.invitationUsers?.push(...response)
    },

    async updateInvitationStatus(
      invitationToTeam: TeamInvitation,
      status: JoinStatus,
    ) {
      const { id, userId } = invitationToTeam
      const response = await TeamService.updateInvitationToTeamStatus(
        id,
        userId,
        status,
      )

      if (response instanceof Error) {
        useNotification('Система', response.message)
        return response
      }

      const currentInvitationToTeam = this.invitationUsers?.find(
        (invitation) => invitation.id === id,
      )

      if (currentInvitationToTeam) {
        currentInvitationToTeam.status = status
      }

      if (status === 'ACCEPTED') {
        const teamsStore = useTeamStore()
        await teamsStore.addTeamMember({ ...invitationToTeam, skills: [] })
      }
    },
  },
})
