import Success from '@Domain/ResponseMessage'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import RequestTeams from '@Domain/RequestTeamToIdea'
import getAbortedSignal from '@Utils/getAbortedSignal'
import useUserStore from '@Store/user/userStore'
import axios from 'axios'
import { API_URL } from '@Main'

const RequestTeamsAxios = defineAxios(getMocks().RequestTeams)

function filterApplicationsById(ideaId: string, request: RequestTeams[]) {
  return request.filter((request) => request.ideaMarketId == ideaId)
}

const getIdeaRequests = async (
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
  return await axios
    .post(`${API_URL}/market/declare`, team, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка добавления заявки'
      return new Error(error)
    })
}

const changeStatusRequest = async (
  teamMarketId: string,
  status: string,
  token: string,
): Promise<Success | Error> => {
  return await axios
    .put(`${API_URL}/market/change-status/request/${teamMarketId}/${status}`, null, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка изменения статуса заявки'
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
  getIdeaRequests,
  postRequest,
  deleteRequestTeams,
  changeStatusRequest,

  acceptRequestTeam,
}

export default RequestTeamsServise
