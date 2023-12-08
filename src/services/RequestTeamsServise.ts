import Success from '@Domain/ResponseMessage'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import { RequestTeams } from '@Domain/RequestTeams'
import getAbortedSignal from '@Utils/getAbortedSignal'
import useUserStore from '@Store/user/userStore'

const RequestTeamsAxios = defineAxios(getMocks().RequestTeams)

function filterApplicationsById(ideaId: string, request: RequestTeams[]) {
  return request.filter((request) => request.ideaId == ideaId)
}

const getRequestAll = async (
  ideaId: string,
  token: string,
): Promise<RequestTeams[] | Error> => {
  return await RequestTeamsAxios.get<RequestTeams[]>(
    `/market/requests/${ideaId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
    { formatter: (applications) => filterApplicationsById(ideaId, applications) },
  )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения заявок'
      return new Error(error)
    })
}

const postRequest = async (
  team: RequestTeams,
  token: string,
): Promise<RequestTeams | Error> => {
  return await RequestTeamsAxios.post('/market/declare', team, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка добавления запроса'
      return new Error(error)
    })
}

const acceptRequestTeam = async (
  team: RequestTeams,
  token: string,
): Promise<Success | Error> => {
  return await RequestTeamsAxios.put<Success>(
    `/market/accept/${team.id}`,
    team,
    { headers: { Authorization: `Bearer ${token}` } },
    {
      params: { id: team.id },
      responseData: { success: 'Успешное принятие команды' },
    },
  )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка принятия команды'
      return new Error(error)
    })
}

// const acceptRequestTeams = async (
//   teams: RequestTeams[],
//   token: string,
// ): Promise<RequestTeams[] | Error> => {
//   return await RequestTeamsAxios.put(
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
  return await RequestTeamsAxios.delete(
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
      const error = response?.data?.error ?? 'Ошибка удаления команды'
      return new Error(error)
    })
}

const RequestTeamsServise = {
  getRequestAll,
  postRequest,
  deleteRequestTeams,

  acceptRequestTeam,
}

export default RequestTeamsServise
