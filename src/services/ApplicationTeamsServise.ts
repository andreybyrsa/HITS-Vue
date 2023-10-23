import Team from '@Domain/Team'
import Success from '@Domain/ResponseMessage'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import ApplicationTeams from '@Domain/ApplicationTeams'

const ApplicationTeamsAxios = defineAxios(getMocks().applicationTeams)

function filterApplicationsById(ideaId: number, applications: ApplicationTeams[]) {
  return applications.filter((application) => application.ideaId === ideaId)
}

const getApplicationsAll = async (
  ideaId: number,
  token: string,
): Promise<ApplicationTeams[] | Error> => {
  return await ApplicationTeamsAxios.get<ApplicationTeams[]>(
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

const postApplication = async (
  team: ApplicationTeams,
  token: string,
): Promise<ApplicationTeams | Error> => {
  return await ApplicationTeamsAxios.post('/application/create', team, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка добавления запроса'
      return new Error(error)
    })
}

const addApplicationTeams = async (
  id: number,
  token: string,
): Promise<Success | Error> => {
  return await ApplicationTeamsAxios.putNoRequestBody<Success>(
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

const ApplicationTeamsServise = {
  getApplicationsAll,
  postApplication,

  addApplicationTeams,
}

export default ApplicationTeamsServise
