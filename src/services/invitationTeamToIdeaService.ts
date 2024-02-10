import {
  InvitationTeamToIdea,
  InvitationTeamToIdeaStatus,
} from '@Domain/InvitationTeamToIdea'
import Success from '@Domain/ResponseMessage'
import { MODE } from '@Main'
import useUserStore from '@Store/user/userStore'
import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import { RequestTeamsMocks, invitationTeamToIdeaMocks } from '@Utils/getMocks'
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
      `/idea-market/${ideaMarketId}/invitations`, // FIX ROUTE
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
      `/user/${userId}/invitations`, // FIX ROUTE
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
      `/team/${teamId}/invitations-to-idea`, // FIX ROUTE
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
      `/idea-market/invitations`, // FIX ROUTE
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
  invitation: InvitationTeamToIdea,
  status: InvitationTeamToIdeaStatus,
  token: string,
): Promise<Success | Error> => {
  const { id, ideaMarketId } = invitation
  if (MODE === 'DEVELOPMENT') {
    if (status === 'ACCEPTED') {
      RequestTeamsMocks.forEach((request) => {
        if (request.status === 'NEW' && request.ideaMarketId === ideaMarketId)
          request.status = 'ANNULLED'
      })
      invitationTeamToIdeaMocks.forEach((invitat) => {
        if (invitat.id !== id && invitat.ideaMarketId === ideaMarketId)
          invitation.status = 'ANNULLED'
      })
    }
  }

  return invitationTeamToIdeaAxios
    .putNoRequestBody<Success | Error>(
      `/invitation/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        params: { id: id },
        requestData: { status: status },
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
