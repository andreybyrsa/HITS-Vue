import { defineStore } from 'pinia'

import InitialState from '@Store/invitationUsers/initialState'
import TeamService from '@Services/TeamService'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import { TeamInvitation, TeamMember } from '@Domain/Team'
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
    async inviteUsers(users: TeamMember[], teamId: string, token: string) {
      const response = await TeamService.invitationTeamMember(users, teamId, token)

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        this.invitationUsers?.push(...response)
      }
    },

    async acceptInvitationToTeam(invitationToTeam: TeamInvitation, token: string) {
      const { id } = invitationToTeam
      const response = await TeamService.updateInvitationToTeamStatus(
        id,
        'ACCEPTED',
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentInvitationToTeam = this.invitationUsers?.find(
          (invitation) => invitation.id === id,
        )

        if (currentInvitationToTeam) {
          currentInvitationToTeam.status = 'ACCEPTED'
        }

        const teamsStore = useTeamStore()
        await teamsStore.addTeamMember({ ...invitationToTeam, skills: [] }, token)
      }
    },

    async cancelInvitationToTeam(invitationToTeam: TeamInvitation, token: string) {
      const { id, teamId, userId } = invitationToTeam
      const response = await TeamService.updateInvitationToTeamStatus(
        id,
        'CANCELED',
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const currentInvitationToTeam = this.invitationUsers?.find(
          (invitation) => invitation.id === id,
        )
        if (currentInvitationToTeam?.status === 'ACCEPTED') {
          currentInvitationToTeam.status = 'CANCELED'

          const teamsStore = useTeamStore()
          await teamsStore.kickTeamMember(teamId, userId, token)
        } else if (currentInvitationToTeam?.status === 'NEW') {
          currentInvitationToTeam.status = 'CANCELED'
        }
      }
    },
  },
})

export default useInvitationUsersStore
