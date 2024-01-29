import { defineStore } from 'pinia'

import invitationTeamToIdeaService from '@Services/invitationTeamToIdeaService'

import InitialState from '@Store/invitationTeamToIdea/initialState'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import {
  InvitationTeamToIdea,
  InvitationTeamToIdeaStatus,
} from '@Domain/InvitationTeamToIdea'

const useInvitationsTeamToIdeaStore = defineStore('invitationsTeamToIdeaStore', {
  state: (): InitialState => ({
    ideaInvitations: [],
  }),

  getters: {
    getIdeaInvitations() {
      return async (ideaId: string, token: string) => {
        const response = await invitationTeamToIdeaService.getIdeaInvitations(
          token,
          ideaId,
        )

        if (response instanceof Error) {
          return response
        }

        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
        } else {
          this.ideaInvitations = response

          return this.ideaInvitations
        }
      }
    },
    getSentInvitations() {
      return async (userId: string, token: string) => {
        const response = await invitationTeamToIdeaService.getSentInvitations(
          userId,
          token,
        )

        if (response instanceof Error) {
          return response
        }

        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
        } else {
          this.ideaInvitations = response
          return this.ideaInvitations
        }
      }
    },
    getTeamInvitations() {
      return async (teamId: string, token: string) => {
        const response = await invitationTeamToIdeaService.getTeamInvitations(
          teamId,
          token,
        )

        if (response instanceof Error) {
          return response
        }

        if (response instanceof Error) {
          useNotificationsStore().createSystemNotification(
            'Система',
            response.message,
          )
        } else {
          this.ideaInvitations = response
          return this.ideaInvitations
        }
      }
    },
  },

  actions: {
    async postInvitationsToIdea(
      ideaId: string,
      invitations: InvitationTeamToIdea[],
      token: string,
    ) {
      const response = await invitationTeamToIdeaService.postTeamInvitationsToIdea(
        ideaId,
        invitations,
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        invitations.forEach((invitation) => {
          this.ideaInvitations.push(invitation)
        })
      }
    },
    async putInvitationForTeamToIdea(
      status: InvitationTeamToIdeaStatus,
      invitationId: string,
      token: string,
    ) {
      const response = await invitationTeamToIdeaService.putInvitationForTeamToIdea(
        invitationId,
        status,
        token,
      )

      if (response instanceof Error) {
        useNotificationsStore().createSystemNotification('Система', response.message)
      } else {
        const invitationIndex = this.ideaInvitations.findIndex(
          (invitation) => invitation.id == invitationId,
        )

        if (invitationIndex !== -1) {
          this.ideaInvitations[invitationIndex].status = status
        }
      }
    },
  },
})

export default useInvitationsTeamToIdeaStore
