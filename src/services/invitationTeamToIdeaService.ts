import {
  InvitationTeamToIdea,
  InvitationTeamToIdeaStatus,
} from '@Domain/InvitationTeamToIdea'
import Success from '@Domain/ResponseMessage'
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

function filterInvitations(invitations: InvitationTeamToIdea[]) {
  return invitations
}

function filterTeamInvitations(invitations: InvitationTeamToIdea[], teamId: string) {
  return invitations.filter((invitation) => invitation.teamId === teamId)
}

// --- GET --- //
const getIdeaInvitations = async (
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

const getSentInvitations = async (
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
        formatter: (applications) => filterInvitations(applications),
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

const postTeamInvitationsToIdea = async (
  id: string,
  invitations: InvitationTeamToIdea[],
  token: string,
): Promise<InvitationTeamToIdea[] | Error> => {
  return invitationTeamToIdeaAxios
    .post(
      `/idea-market/${id}/invitations`, // FIX ROUTE
      invitations,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка отправки приглашений'))
}

// --- PUT --- //

const putInvitationForTeamToIdea = async (
  invitationId: string,
  status: InvitationTeamToIdeaStatus,
  token: string,
): Promise<Success | Error> => {
  return invitationTeamToIdeaAxios
    .putNoRequestBody<Success | Error>(
      `/invitation/${invitationId}`, // FIX ROUTE
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        params: { id: invitationId },
        requestData: { status: status },
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка отзыва приглашения'))
}

const InvitationTeamToIdeaService = {
  getIdeaInvitations,
  postTeamInvitationsToIdea,
  putInvitationForTeamToIdea,
  getSentInvitations,
  getTeamInvitations,
}

export default InvitationTeamToIdeaService
