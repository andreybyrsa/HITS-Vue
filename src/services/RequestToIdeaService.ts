import { RequestTeamToIdea, RequestToIdeaStatus } from '@Domain/RequestTeamToIdea'
import Success from '@Domain/ResponseMessage'

import useUserStore from '@Store/user/userStore'
import axios from 'axios'
import { API_URL } from '@Main'

import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import getMocks from '@Utils/getMocks'

const requestTeamsAxios = defineAxios(getMocks().RequestTeams)

function filterRequestsToIdeaByIdeaId(ideaId: string, request: RequestTeamToIdea[]) {
  return request.filter((request) => request.ideaMarketId === ideaId)
}

const getIdeaRequests = async (
  ideaId: string,
  token: string,
): Promise<RequestTeamToIdea[] | Error> => {
  return await requestTeamsAxios
    .get<RequestTeamToIdea[]>(
      `/market/requests/${ideaId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      {
        formatter: (applications) =>
          filterRequestsToIdeaByIdeaId(ideaId, applications),
      },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения заявок'
      return new Error(error)
    })
}

const postRequest = async (
  team: RequestTeamToIdea,
  token: string,
): Promise<RequestTeamToIdea | Error> => {
  return await requestTeamsAxios
    .post(`${API_URL}/market/declare`, team, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка отправки заявки'
      return new Error(error)
    })
}

const updateRequestToIdeaStatus = async (
  id: string,
  status: RequestToIdeaStatus,
  token: string,
): Promise<Success | Error> => {
  return await requestTeamsAxios
    .put<Success>(
      `/market/change-status/request/${id}/${status}`,
      { status: status },
      { headers: { Authorization: `Bearer ${token}` } },
      {
        params: { id },
        responseData: { success: 'Успешное изменение статуса' },
      },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка изменения статуса заявки'
      return new Error(error)
    })
}

const annulatedRequestsToIdea = async (
  teamId: string,
  status: RequestToIdeaStatus,
  token: string,
): Promise<Success | Error> => {
  return await requestTeamsAxios
    .put<Success>(
      `/market/change-status/request/${teamId}/${status}`,
      { status: status },
      { headers: { Authorization: `Bearer ${token}` } },
      {
        params: { teamId },
        responseData: { success: 'Успешное изменение статуса' },
      },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка изменения статуса заявки'
      return new Error(error)
    })
}

const deleteRequestTeams = async (
  id: string,
  token: string,
): Promise<Success | Error> => {
  return await requestTeamsAxios
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
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка удаления заявки'
      return new Error(error)
    })
}

const RequestTeamsServise = {
  getIdeaRequests,

  postRequest,

  updateRequestToIdeaStatus,
  annulatedRequestsToIdea,

  deleteRequestTeams,
}

export default RequestTeamsServise
