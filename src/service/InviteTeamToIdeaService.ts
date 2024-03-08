import { MODE } from '@Config'
import { InvitationTeamToIdea, InvitationTeamToIdeaStatus, Success } from '@Domain'
import { TryCatch, defineAxios, invitationTeamToIdeaMocks } from '@Utils'

const invitationTeamToIdeaDefineApi = defineAxios(invitationTeamToIdeaMocks)

const filterInvitationsByMarketId = (
  ideaMarketId: string,
  invitations: InvitationTeamToIdea[],
) => {
  return invitations.filter((invitation) => invitation.ideaId == ideaMarketId)
}

const filterInvitationsByInitiator = (
  invitations: InvitationTeamToIdea[],
  userId: string,
) => {
  return invitations.filter(({ initiatorId }) => initiatorId === userId)
}

const filterTeamInvitations = (
  invitations: InvitationTeamToIdea[],
  teamId: string,
) => {
  return invitations.filter((invitation) => invitation.teamId === teamId)
}

export class InviteTeamToIdeaService {
  @TryCatch
  static async getInvitationsByIdea(
    ideaMarketId: string,
  ): Promise<InvitationTeamToIdea[] | Error> {
    const response = await invitationTeamToIdeaDefineApi.get<InvitationTeamToIdea[]>(
      `/idea/invitation/all/${ideaMarketId}`,
      {},
      {
        formatter: (applications) =>
          filterInvitationsByMarketId(ideaMarketId, applications),
      },
    )
    return response.data
  }

  @TryCatch
  static async getAllInvitationsByInitiator(
    userId: string,
  ): Promise<InvitationTeamToIdea[] | Error> {
    const response = await invitationTeamToIdeaDefineApi.get<InvitationTeamToIdea[]>(
      '/idea/invitation/all/initiator',
      {},
      {
        formatter: (applications) =>
          filterInvitationsByInitiator(applications, userId),
      },
    )
    return response.data
  }

  @TryCatch
  static async getTeamInvitations(
    teamId: string,
  ): Promise<InvitationTeamToIdea[] | Error> {
    const response = await invitationTeamToIdeaDefineApi.get<InvitationTeamToIdea[]>(
      `/idea/invitation/team/all/${teamId}`, // FIX ROUTE
      {},
      {
        formatter: (applications) => filterTeamInvitations(applications, teamId),
      },
    )
    return response.data
  }

  @TryCatch
  static async inviteTeamToIdea(
    invitation: InvitationTeamToIdea,
  ): Promise<InvitationTeamToIdea | Error> {
    const response = await invitationTeamToIdeaDefineApi.post(
      `/idea/invitation/${invitation.teamId}/${invitation.ideaId}`,
      invitation,
    )
    return response.data
  }

  @TryCatch
  static async changeInvitationStatus(
    invitationId: string,
    status: InvitationTeamToIdeaStatus,
    ideaId?: string,
    teamId?: string,
  ): Promise<Success | Error> {
    if (MODE === 'DEVELOPMENT') {
      if (status === 'ACCEPTED') {
        invitationTeamToIdeaMocks.forEach((invitation) => {
          if (invitation.id === invitationId) {
            invitation.status = status
          }
          invitation.status = 'ANNULLED'
        })
      }
    }

    const response = await invitationTeamToIdeaDefineApi.put<Success | Error>(
      '/idea/invitation/status',
      { id: invitationId, teamId: teamId, ideaId: ideaId, status: status },
      {},
      {
        params: { id: invitationId },
      },
    )
    return response.data
  }
}
