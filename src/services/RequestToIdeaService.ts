import { RequestTeamToIdea, RequestToIdeaStatus } from '@Domain/RequestTeamToIdea'
import Success from '@Domain/ResponseMessage'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'

const requestTeamsAxios = defineAxios([] as RequestTeamToIdea[])

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
    .post('/market/declare', team, {
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
    .putNoRequestBody<Success>(
      `/market/accept/${id}/${status}`,
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

// const acceptRequestTeams = async (
//   teams: RequestTeamToIdea[],
//   token: string,
// ): Promise<RequestTeamToIdea[] | Error> => {
//   return await requestTeamsAxios.put(
//     `/application/add/${teams}`,
//     teams,
//     { headers: { Authorization: `Bearer ${token}` } },
//     {
//       comparingKey: 'id',
//       responseData: { success: 'Успешное принятие команды' },
//     },
//   )
//     .then((response) => response.data)
//     .catch(({ response }) => {
//       const error = response?.data?.error ?? 'Ошибка принятия команды'
//       return new Error(error)
//     })
// }

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

  deleteRequestTeams,
}

export default RequestTeamsServise
