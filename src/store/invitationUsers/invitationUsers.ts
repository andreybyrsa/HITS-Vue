import { defineStore } from 'pinia'

import { TeamInvitation } from '@Domain/Team'

import InitialState from '@Store/invitationUsers/initialState'
import TeamService from '@Services/TeamService'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import { User } from '@Domain/User'

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
    async inviteUsers(users: User[], teamId: string, token: string) {
      const invitationTeamMembers: TeamInvitation[] = users.map((user) => {
        return {
          id: user.id,
          teamId: teamId,
          userId: user.id,
          email: user.email,
          firstName: user.email,
          lastName: user.lastName,
        }
      })

      const response = await TeamService.invitationTeamMember(
        invitationTeamMembers,
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        this.invitationUsers?.push(...response)
      }
    },
  },
})

export default useInvitationUsersStore
