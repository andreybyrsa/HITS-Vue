import { Team, TeamSkills } from '@Domain/Team'
import Success from '@Domain/ResponseMessage'
import TeamMember from '@Domain/TeamMember'
import useUserStore from '@Store/user/userStore'
import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'
const teamsAxios = defineAxios(getMocks().teams)
const teamMemberAxios = defineAxios(getMocks().teamMember)
const teamSkillsAxios = defineAxios(getMocks().teamSkills)
const getTeams = async (token: string): Promise<Team[] | Error> => {
  return await teamsAxios
    .get('/team/all', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения команд'
      return new Error(error)
    })
}
const getTeam = async (id: string, token: string): Promise<Team | Error> => {
  return await teamsAxios
    .get(
      `/team/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения команды'
      return new Error(error)
    })
}
const getTeamMembers = async (token: string): Promise<TeamMember[] | Error> => {
  return await teamMemberAxios
    .get('/users/all', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения компетенций'
      return new Error(error)
    })
}
const getTeamSkills = async (
  teamId: string,
  token: string,
): Promise<TeamSkills | Error> => {
  return await teamSkillsAxios
    .get(
      `/team/skills/${teamId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { teamId } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки компетенций команды'
      return new Error(error)
    })
}
const createTeam = async (team: Team, token: string): Promise<Team | Error> => {
  return await teamsAxios
    .post('/team/create', team, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка создания команды'
      return new Error(error)
    })
}
const createTeamSkills = async (
  teamSkills: TeamSkills,
  token: string,
): Promise<TeamSkills | Error> => {
  return await teamSkillsAxios
    .post('/team/skills/add', teamSkills, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки компетенций команды'
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
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id }, responseData: { success: 'Успешное обновление команды' } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка обновления команды'
      return new Error(error)
    })
}
const updateTeamSkills = async (
  teamId: string,
  teamSkills: TeamSkills,
  token: string,
): Promise<TeamSkills | Error> => {
  return await teamSkillsAxios
    .put(
      '/team/skills/update',
      teamSkills,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { teamId } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки компетенций команды'
      return new Error(error)
    })
}
const deleteTeam = async (id: string, token: string): Promise<Success | Error> => {
  return await teamsAxios
    .delete(
      `/team/delete/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка удаления команды'
      return new Error(error)
    })
}
const TeamService = {
  getTeams,
  getTeam,
  getTeamMembers,
  getTeamSkills,
  createTeam,
  createTeamSkills,
  updateTeam,
  updateTeamSkills,
  deleteTeam,
}
export default TeamService
