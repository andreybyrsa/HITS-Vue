import { defineStore } from 'pinia'
import { Team, InvitationTeamToIdea, InvitationTeamToIdeaStatus } from '@Domain'
import { useIdeasMarketStore, useRequestsToIdeaStore, useTeamStore } from '@Store'
import { useNotification } from '@Hooks'
import { InviteTeamToIdeaService } from '@Service'
import { findOneAndUpdate } from '@Utils'

interface InitialState {
  ideaInvitations: InvitationTeamToIdea[]
}

export const useInvitationsTeamToIdeaStore = defineStore(
  'invitationsTeamToIdeaStore',
  {
    state: (): InitialState => ({
      ideaInvitations: [],
    }),

    getters: {
      getIdeaInvitations() {
        return async (ideaId: string) => {
          const response = await InviteTeamToIdeaService.getInvitationsByIdea(ideaId)

          if (response instanceof Error) {
            useNotification('Система', response.message)
            return response
          }

          this.ideaInvitations = response
          return this.ideaInvitations
        }
      },

      getIdeaInvitationsByInitiator() {
        return async (userId: string) => {
          const response =
            await InviteTeamToIdeaService.getAllInvitationsByInitiator(userId)

          if (response instanceof Error) {
            return response
          }

          if (response instanceof Error) {
            useNotification('Система', response.message)
            return response
          }

          return response.forEach((item: any) =>
            findOneAndUpdate(this.ideaInvitations, item, {
              key: 'id',
              value: item.id,
            }),
          )
        }
      },

      getTeamInvitations() {
        return async (teamId: string) => {
          const response = await InviteTeamToIdeaService.getTeamInvitations(teamId)

          if (response instanceof Error) {
            return response
          }

          if (response instanceof Error) {
            useNotification('Система', response.message)
            return response
          }

          this.ideaInvitations = response
          return this.ideaInvitations
        }
      },
    },

    actions: {
      async postInvitationsToIdea(invitation: InvitationTeamToIdea) {
        const response = await InviteTeamToIdeaService.inviteTeamToIdea(invitation)

        if (response instanceof Error) {
          useNotification('Система', response.message)
          return response
        }

        this.ideaInvitations.push(response)
      },

      async putInvitationForTeamToIdea(
        status: InvitationTeamToIdeaStatus,
        invitationId: string,
        ideaMarketId?: string,
        team?: Team,
      ) {
        const teamStore = useTeamStore()
        const ideasMarketStore = useIdeasMarketStore()
        const requestTeamInIdea = useRequestsToIdeaStore()

        const response = await InviteTeamToIdeaService.changeInvitationStatus(
          invitationId,
          status,

          status === 'ACCEPTED' ? ideaMarketId : '',
          status === 'ACCEPTED' ? team?.id : '',
        )

        if (response instanceof Error) {
          useNotification('Система', response.message)
          return response
        }

        const currentInvitation = this.ideaInvitations.find(
          ({ id }) => id === invitationId,
        )

        if (currentInvitation) {
          currentInvitation.status = status
        }

        if (status === 'ACCEPTED' && team) {
          this.ideaInvitations.forEach((invite) => {
            if (invite.status === 'NEW') {
              invite.status = 'ANNULLED'
            }
          })

          requestTeamInIdea.requests.forEach((request: any) => {
            if (request.ideaMarketId === ideaMarketId && request.status === 'NEW') {
              request.status = 'ANNULLED'
            }
          })

          ideasMarketStore.ideasMarket.forEach((idea) => {
            if (idea.id === ideaMarketId) {
              idea.status = 'RECRUITMENT_IS_CLOSED'
              idea.team = team
            }
          })

          const currentTeam = teamStore.teams.find(({ id }) => id === team.id)

          if (currentTeam) {
            currentTeam.hasActiveProject = true
          }
        }
      },
    },
  },
)
