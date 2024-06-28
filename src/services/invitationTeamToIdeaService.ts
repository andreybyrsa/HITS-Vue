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
  return invitations.filter((invitation) => invitation.ideaId == ideaMarketId)
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
      `/api/v1/ideas-service/idea/invitation/all/${ideaMarketId}`,
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
      `/api/v1/ideas-service/idea/invitation/all/initiator`,
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
      `/api/v1/ideas-service/idea/invitation/team/all/${teamId}`, // FIX ROUTE
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
      `/api/v1/ideas-service/idea/invitation/${invitation.teamId}/${invitation.ideaId}`,
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

  return invitationTeamToIdeaAxios
    .put<Success | Error>(
      `/api/v1/ideas-service/idea/invitation/status`,
      { id: invitationId, teamId: teamId, ideaId: ideaId, status: status },
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
