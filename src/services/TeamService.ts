import Team from '@Domain/Team'
import Success from '@Domain/ResponseMessage'
import TeamMember from '@Domain/TeamMember'
import { TeamAccession } from '@Domain/TeamAccession'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'

const teamsAxios = defineAxios(getMocks().teams)
const teamMemberAxios = defineAxios(getMocks().profiles)
const teamAccessions = defineAxios(getMocks().teamAccessions)
const teamRequests = defineAxios(getMocks().teamRequests)
const unregisteredInvitations = defineAxios(getMocks().unregisteredInvitations)
const registeredInvitations = defineAxios(getMocks().registeredInvitations)

const getTeams = async (token: string): Promise<Team[] | Error> => {
  return await teamsAxios
    .get(`/teams/all `, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения команд'
      return new Error(error)
    })
}

const getTeam = async (id: number, token: string): Promise<Team | Error> => {
  return await teamsAxios
    .get(
      `/teams/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения команды'
      return new Error(error)
    })
}

const createTeam = async (team: Team, token: string): Promise<Team | Error> => {
  return await teamsAxios
    .post(`/teams/add`, team, {
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
  id: number,
  token: string,
): Promise<Success | Error> => {
  return await teamsAxios
    .put<Success>(
      `/teams/update/${id}`,
      team,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка обновления команды'
      return new Error(error)
    })
}

const deleteTeam = async (id: number, token: string): Promise<Success | Error> => {
  return await teamsAxios
    .delete(
      `/teams/delete/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      { responseData: { success: 'Успешное удаление' }, params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка удаления команды'
      return new Error(error)
    })
}

const kickMember = async (
  member: TeamMember,
  teamId: number,
  token: string,
): Promise<Success | Error> => {
  return await teamMemberAxios
    .put<Success>(
      `/teams/kick/${teamId}`,
      member,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      { params: { id: `${teamId}` } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка кика пользователя'
      return new Error(error)
    })
}

const deleteTeamAccession = async (
  id: number,
  token: string,
): Promise<Success | Error> => {
  return await teamAccessions
    .delete(
      `/teams/accession/delete/${id}`,
      { headers: { Authorization: `Bearer ${token}` } },
      { responseData: { success: 'Успешное удаление' }, params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка'
      return new Error(error)
    })
}

const inviteRegisteredUsers = async (
  emails: string[],
  teamId: number,
  token: string,
): Promise<Success | Error> => {
  return await registeredInvitations
    .post<Success>(
      `/teams/send-invite/${teamId}`,
      { emails },
      { headers: { Authorization: `Bearer ${token}` } },
      { responseData: { success: 'Успешное приглашение новых пользователей' } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка приглашения пользователя'
      return new Error(error)
    })
}

const inviteUnregisteredUsers = async (
  emails: string[],
  teamId: number,
  token: string,
): Promise<Success | Error> => {
  return await unregisteredInvitations
    .post<Success>(
      `/teams/send-invite-unregistered/${teamId}`,
      { emails },
      { headers: { Authorization: `Bearer ${token}` } },
      {
        responseData: { success: 'Успешное приглашение новых пользователей' },
      },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка приглашения пользователя'
      return new Error(error)
    })
}

const fetchInvitationsAndRequestions = async (
  teamId: number,
  token: string,
): Promise<TeamAccession[] | Error> => {
  return await teamAccessions
    .get(`/teams/invitations/${teamId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки приглашений и заявок'
      return new Error(error)
    })
}

const getTeamRequest = async (
  id: number,
  token: string,
): Promise<TeamAccession | Error> => {
  return await teamRequests
    .get(
      `/teams/request/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки заявки'
      return new Error(error)
    })
}

const sendRequest = async (
  teamId: number,
  teamRequest: TeamAccession,
  token: string,
): Promise<Success | Error> => {
  return await teamAccessions
    .post<Success>(
      `/teams/request/${teamId}`,
      teamRequest,
      { headers: { Authorization: `Bearer ${token}` } },
      { responseData: { success: 'Успешная отправка заявки' } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка отправки заявления'
      return new Error(error)
    })
}

const responseToRequest = async (
  teamRequest: TeamAccession,
  token: string,
): Promise<Success | Error> => {
  return await teamAccessions
    .put<Success>(
      `/teams/update/${teamRequest.id}`,
      teamRequest,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      {
        params: { id: teamRequest.id },
        responseData: { success: 'Успешный ответ на заявку' },
      },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка обновления команды'
      return new Error(error)
    })
}

const getAllTeamProfiles = async (token: string): Promise<TeamMember[] | Error> => {
  return teamMemberAxios
    .get('/teams/all-profiles', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error
      return new Error(error)
    })
}

const getTeamProfile = async (
  id: number,
  token: string,
): Promise<TeamMember | Error> => {
  return teamMemberAxios
    .get(
      `/teams/profile/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error
      return new Error(error)
    })
}

const TeamService = {
  getTeams,
  getTeam,
  createTeam,
  inviteRegisteredUsers,
  inviteUnregisteredUsers,
  deleteTeamAccession,
  fetchInvitationsAndRequestions,
  kickMember,
  updateTeam,
  deleteTeam,
  sendRequest,
  getTeamRequest,
  responseToRequest,
  getAllTeamProfiles,
  getTeamProfile,
}

export default TeamService
