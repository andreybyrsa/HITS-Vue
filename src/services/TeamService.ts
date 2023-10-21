import Team from '@Domain/Team'
import Success from '@Domain/ResponseMessage'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import TeamMember from '@Domain/TeamMember'

const teamsAxios = defineAxios(getMocks().teams)
const teamMemberAxios = defineAxios(getMocks().teamMember)

const getTeamMembers = async (token: string): Promise<TeamMember[] | Error> => {
  return await teamMemberAxios
    .get('/users/all', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения компетенций'
      return new Error(error)
    })
}

const getTeams = async (token: string): Promise<Team[] | Error> => {
  return await teamsAxios
    .get('/team/all', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения команд'
      return new Error(error)
    })
}

const getTeam = async (
  id: string | string[],
  token: string,
): Promise<Team | Error> => {
  return await teamsAxios
    .get(
      `/team/${id}`,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { id: `${id}` } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения команды'
      return new Error(error)
    })
}

const createTeam = async (team: Team, token: string): Promise<Team | Error> => {
  return await teamsAxios
    .post('/team/create', team, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка создания команды'
      return new Error(error)
    })
}

const updateTeam = async (
  team: Team,
  id: string,
  token: string,
): Promise<Success | Error> => {
  return await teamsAxios
    .put<Success>(
      `/team/update/${id}`,
      team,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { id }, responseData: { success: 'Успешное обновление команды' } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка обновления команды'
      return new Error(error)
    })
}

const deleteTeam = async (id: string, token: string): Promise<Success | Error> => {
  return await teamsAxios
    .delete(
      `/team/delete/${id}`,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка удаления команды'
      return new Error(error)
    })
}

const TeamService = {
  getTeamMembers,
  getTeams,
  getTeam,
  createTeam,
  updateTeam,
  deleteTeam,
}

export default TeamService
