import { MODE } from '@Config'
import { InvitationTeamToIdea, InvitationTeamToIdeaStatus, Success } from '@Domain'
import { defineAxios, invitationTeamToIdeaMocks } from '@Utils'

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

const getInvitationsByIdea = async (
  ideaMarketId: string,
): Promise<InvitationTeamToIdea[] | Error> => {
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

const getAllInvitationsByInitiator = async (
  userId: string,
): Promise<InvitationTeamToIdea[] | Error> => {
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

const getTeamInvitations = async (
  teamId: string,
): Promise<InvitationTeamToIdea[] | Error> => {
  const response = await invitationTeamToIdeaDefineApi.get<InvitationTeamToIdea[]>(
    `/idea/invitation/team/all/${teamId}`, // FIX ROUTE
    {},
    {
      formatter: (applications) => filterTeamInvitations(applications, teamId),
    },
  )
  return response.data
}

const inviteTeamToIdea = async (
  invitation: InvitationTeamToIdea,
): Promise<InvitationTeamToIdea | Error> => {
  const response = await invitationTeamToIdeaDefineApi.post(
    `/idea/invitation/${invitation.teamId}/${invitation.ideaId}`,
    invitation,
  )
  return response.data
}

const changeInvitationStatus = async (
  invitationId: string,
  status: InvitationTeamToIdeaStatus,
  ideaId?: string,
  teamId?: string,
): Promise<Success | Error> => {
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

export const InviteTeamToIdeaService = {
  getInvitationsByIdea,
  getAllInvitationsByInitiator,
  getTeamInvitations,
  inviteTeamToIdea,
  changeInvitationStatus,
}
