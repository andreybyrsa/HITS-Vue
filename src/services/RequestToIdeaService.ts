import { RequestTeamToIdea, RequestToIdeaStatus } from '@Domain/RequestTeamToIdea'
import Success from '@Domain/ResponseMessage'
import { Team } from '@Domain/Team'
import { MODE } from '@Main'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import {
  RequestTeamsMocks,
  teamsMocks,
  ideasMarketMocks,
  invitationTeamToIdeaMocks,
} from '@Utils/getMocks'
import handleAxiosError from '@Utils/handleAxiosError'
import axios from 'axios'

const requestTeamsAxios = defineAxios(RequestTeamsMocks)

function filterRequestsToIdeaByIdeaId(ideaId: string, request: RequestTeamToIdea[]) {
  return request.filter((request) => request.ideaMarketId === ideaId)
}

// --- GET --- //
const getIdeaRequests = async (
  ideaId: string,
  token: string,
): Promise<RequestTeamToIdea[] | Error> => {
  return requestTeamsAxios
    .get<RequestTeamToIdea[]>(
      `/market/idea/requests/${ideaId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      {
        formatter: (applications) =>
          filterRequestsToIdeaByIdeaId(ideaId, applications),
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения заявок'))
}

// --- POST --- //
const postRequest = async (
  team: RequestTeamToIdea,
  token: string,
): Promise<RequestTeamToIdea | Error> => {
  return requestTeamsAxios
    .post(`/market/idea/declare`, team, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка отправки заявки'))
}

// --- PUT --- //
const updateRequestToIdeaStatus = async (
  id: string,
  status: RequestToIdeaStatus,
  token: string,
): Promise<Success | Error> => {
  return requestTeamsAxios
    .put<Success>(
      `/market/idea/change-status/request/${id}/${status}`,
      { status: status },
      { headers: { Authorization: `Bearer ${token}` } },
      {
        params: { id },
        responseData: { success: 'Успешное изменение статуса' },
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка изменения статуса заявки'))
}

const acceptRequestToIdea = async (
  requestId: string,
  ideaMarketId: string,
  teamId: string,
  token: string,
): Promise<Team | Error> => {
  if (MODE === 'DEVELOPMENT') {
    const currentTeam = teamsMocks.find(({ id }) => id === teamId)

    if (currentTeam) {
      invitationTeamToIdeaMocks.forEach(
        (invitation) =>
          invitation.ideaMarketId === ideaMarketId &&
          invitation.status === 'NEW' &&
          (invitation.status = 'ANNULLED'),
      )
      RequestTeamsMocks.forEach(
        (request) =>
          (request.id === requestId && (request.status = 'ACCEPTED')) ||
          ((request.teamId === teamId ||
            (request.ideaMarketId === ideaMarketId && request.status === 'NEW')) &&
            (request.status = 'ANNULLED')),
      )
      ideasMarketMocks.forEach((idea) => {
        if (idea.id === ideaMarketId) {
          idea.team = currentTeam
          idea.status = 'RECRUITMENT_IS_CLOSED'
        }
      })
      return currentTeam
    }
  }

  return axios
    .put<Team>(
      `/market/idea/accept/request/${ideaMarketId}/${teamId}`,
      { status: 'ACCEPTED' },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка принятия заявки'))
}

// --- DELETE --- //
const deleteRequestTeams = async (
  id: string,
  token: string,
): Promise<Success | Error> => {
  return requestTeamsAxios
    .delete(
      `/market/delete/request/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        params: { id },
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка удаления заявки'))
}

const RequestTeamsServise = {
  getIdeaRequests,

  postRequest,

  updateRequestToIdeaStatus,
  acceptRequestToIdea,

  deleteRequestTeams,
}

export default RequestTeamsServise
