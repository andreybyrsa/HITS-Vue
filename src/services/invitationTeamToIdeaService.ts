import {
  InvitationTeamToIdea,
  InvitationTeamToIdeaStatus,
} from '@Domain/InvitationTeamToIdea'
import Success from '@Domain/ResponseMessage'
import { MODE } from '@Main'
import useUserStore from '@Store/user/userStore'
import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import { invitationTeamToIdeaMocks } from '@Utils/getMocks'
import handleAxiosError from '@Utils/handleAxiosError'

const invitationTeamToIdeaAxios = defineAxios(invitationTeamToIdeaMocks)

function filterInvitationsByMarketId(
  ideaMarketId: string,
  invitations: InvitationTeamToIdea[],
) {
  return invitations.filter((invitation) => invitation.ideaMarketId == ideaMarketId)
}

function filterInvitationsByInitiator(
  invitations: InvitationTeamToIdea[],
  userId: string,
) {
  return invitations.filter(({ initiatorId }) => initiatorId === userId)
}

function filterTeamInvitations(invitations: InvitationTeamToIdea[], teamId: string) {
  return invitations.filter((invitation) => invitation.teamId === teamId)
}

// --- GET --- //
const getInvitationsByIdea = async (
  token: string,
  ideaMarketId: string,
): Promise<InvitationTeamToIdea[] | Error> => {
  return invitationTeamToIdeaAxios
    .get<InvitationTeamToIdea[]>(
      `/idea/invitation/all/${ideaMarketId}`, // FIX ROUTE
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        formatter: (applications) =>
          filterInvitationsByMarketId(ideaMarketId, applications),
      },
    )
    .then((response) => response.data)
    .catch((error) =>
      handleAxiosError(error, 'Ошибка получения отправленных приглашений'),
    )
}

const getAllInvitationsByInitiator = async (
  userId: string,
  token: string,
): Promise<InvitationTeamToIdea[] | Error> => {
  return invitationTeamToIdeaAxios
    .get<InvitationTeamToIdea[]>(
      `/idea/invitation//${userId}/invitations`, // FIX ROUTE
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        formatter: (applications) =>
          filterInvitationsByInitiator(applications, userId),
      },
    )
    .then((response) => response.data)
    .catch((error) =>
      handleAxiosError(error, 'Ошибка получения отправленных приглашений'),
    )
}

const getTeamInvitations = async (
  teamId: string,
  token: string,
): Promise<InvitationTeamToIdea[] | Error> => {
  return invitationTeamToIdeaAxios
    .get<InvitationTeamToIdea[]>(
      `/idea/invitation/team/all/${teamId}`, // FIX ROUTE
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        formatter: (applications) => filterTeamInvitations(applications, teamId),
      },
    )
    .then((response) => response.data)
    .catch((error) =>
      handleAxiosError(error, 'Ошибка получения приглашений команды'),
    )
}

// --- POST --- //

const inviteTeamToIdea = async (
  invitation: InvitationTeamToIdea,
  token: string,
): Promise<InvitationTeamToIdea | Error> => {
  return invitationTeamToIdeaAxios
    .post(
      `/idea/invitation/${invitation.teamId}/${invitation.ideaMarketId}`, // FIX ROUTE
      invitation,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка отправки приглашения'))
}

// --- PUT --- //

const changeInvitationStatus = async (
  invitationId: string,
  status: InvitationTeamToIdeaStatus,
  token: string,
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

  return invitationTeamToIdeaAxios
    .put<Success | Error>(
      `/idea/invitation/status`,
      { status: status }, // FIX ROUTE
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        params: { id: invitationId },
      },
    )
    .then((response) => response.data)
    .catch((error) =>
      handleAxiosError(error, 'Ошибка изменения статуса приглашения'),
    )
}

const InvitationTeamToIdeaService = {
  getInvitationsByIdea,
  getAllInvitationsByInitiator,
  getTeamInvitations,

  inviteTeamToIdea,

  changeInvitationStatus,
}

export default InvitationTeamToIdeaService
