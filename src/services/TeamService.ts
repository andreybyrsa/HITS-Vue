import Team from '@Domain/Team'
import Success from '@Domain/ResponseMessage'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import TeamMember from '@Domain/TeamMember'
import { Letter } from '@Components/Modals/TeamModal/RequestModal.types'

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

const invitePortalUsers = async (
  users: User[],
  teamId: string,
  token: string,
): Promise<Success | Error> => {
  return await axios
    .post(`${TEAM_URL}/send-invite/${teamId}`, users, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка приглашения пользователя'
      return new Error(error)
    })
}

const inviteOutsideUsers = async (
  emails: string[],
  teamId: string,
  token: string,
): Promise<Success | Error> => {
  return await axios
    .post(`${TEAM_URL}/send-invite-unregistered/${teamId}`, emails, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка приглашения пользователя'
      return new Error(error)
    })
}

const kickMember = async (
  user: User,
  teamId: string,
  token: string,
): Promise<Success | Error> => {
  return await axios
    .put(`${TEAM_URL}/kick/${teamId}`, user, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка кика пользователя'
      return new Error(error)
    })
}

const requestToTheTeam = async (
  teamId: string,
  letter: Letter,
  token: string,
): Promise<Success | Error> => {
  return await axios
    .post(`${TEAM_URL}/request/${teamId}`, letter, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка отправки заявления'
      return new Error(error)
    })
}

const TeamService = {
  getTeamMembers,
  getTeams,
  getTeam,
  createTeam,
  invitePortalUsers,
  inviteOutsideUsers,
  kickMember,
  updateTeam,
  deleteTeam,
  requestToTheTeam,
}

export default TeamService
