import { defineStore } from 'pinia'

import { TeamInvitation, InvitationToTeamStatus } from '@Domain/Team'

import TeamService from '@Services/TeamService'

import InitialState from '@Store/invitationUsers/initialState'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import useTeamStore from '@Store/teams/teamsStore'

const useInvitationUsersStore = defineStore('invitationUsers', {
  state: (): InitialState => ({
    invitationUsers: [],
  }),

  getters: {
    getInvitationUsers() {
      return async (teamId: string, token: string) => {
        const response = await TeamService.getTeamInvitations(teamId, token)

        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
        } else {
          this.invitationUsers = response
          return this.invitationUsers
        }
      }
    },
  },

  actions: {
    async inviteUsers(
      invitationsToTeam: TeamInvitation[],
      teamId: string,
      token: string,
    ) {
      const response = await TeamService.createInvitationsToTeam(
        invitationsToTeam,
        teamId,
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        this.invitationUsers?.push(...response)
      }
    },

    async updateInvitationStatus(
      invitationToTeam: TeamInvitation,
      status: InvitationToTeamStatus,
      token: string,
    ) {
      const { id, userId } = invitationToTeam
      const response = await TeamService.updateInvitationToTeamStatus(
        id,
        userId,
        status,
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentInvitationToTeam = this.invitationUsers?.find(
          (invitation) => invitation.id === id,
        )

        if (currentInvitationToTeam) {
          currentInvitationToTeam.status = status
        }

        if (status === 'ACCEPTED') {
          const teamsStore = useTeamStore()
          await teamsStore.addTeamMember({ ...invitationToTeam, skills: [] }, token)
        }
      }
    },
  },
})

export default useInvitationUsersStore
