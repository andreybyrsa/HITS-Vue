import Success from '@Domain/ResponseMessage'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import RequestTeams from '@Domain/RequestTeams'

const RequestTeamsAxios = defineAxios(getMocks().RequestTeams)

function filterApplicationsById(ideaId: string, request: RequestTeams[]) {
  return request.filter((request) => request.ideaId === ideaId)
}

const getRequestAll = async (
  ideaId: string,
  token: string,
): Promise<RequestTeams[] | Error> => {
  return await RequestTeamsAxios.get<RequestTeams[]>(
    '/application/all',
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
  return await RequestTeamsAxios.post('/application/create', team, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка добавления запроса'
      return new Error(error)
    })
}

const addRequestTeams = async (
  id: number,
  token: string,
): Promise<Success | Error> => {
  return await RequestTeamsAxios.putNoRequestBody<Success>(
    `/application/add/${id}`,
    { headers: { Authorization: `Bearer ${token}` } },
    {
      params: { id },
      requestData: { accepted: true },
      responseData: { success: 'Успешная отправка идеи' },
    },
  )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка принятия команды'
      return new Error(error)
    })
}

const RequestTeamsServise = {
  getRequestAll,
  postRequest,

  addRequestTeams,
}

export default RequestTeamsServise
