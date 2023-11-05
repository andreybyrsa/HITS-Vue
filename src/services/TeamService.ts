import Team from '@Domain/Team'
import Success from '@Domain/ResponseMessage'
import TeamMember from '@Domain/TeamMember'

import useUserStore from '@Store/user/userStore'
import { TeamAccession } from '@Domain/TeamAccession'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'

const teamsAxios = defineAxios(getMocks().teams)
const teamMemberAxios = defineAxios(getMocks().teamMember)
const teamAccessions = defineAxios(getMocks().teamAccessions)
const unregisteredInvitations = defineAxios(getMocks().unregisteredInvitations)
const registeredInvitations = defineAxios(getMocks().registeredInvitations)

const getTeams = async (token: string): Promise<Team[] | Error> => {
  return await teamsAxios
    .get(`/team/all `, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
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

const getAllTeamProfiles = async (token: string): Promise<TeamMember[] | Error> => {
  return teamMemberAxios
    .get('/team/all-profiles', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
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
      `/team/profile/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error
      return new Error(error)
    })
}

const getAllTeamAccessions = async (
  teamId: number,
  token: string,
): Promise<TeamAccession[] | Error> => {
  return await teamAccessions
    .get(`/team/invitations/${teamId}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки приглашений и заявок'
      return new Error(error)
    })
}

const createTeam = async (team: Team, token: string): Promise<Team | Error> => {
  return await teamsAxios
    .post(`/team/add`, team, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка создания команды'
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
      `/team/send-invite/${teamId}`,
      { emails },
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
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
      `/team/send-invite-unregistered/${teamId}`,
      { emails },
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
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

const sendRequest = async (
  teamRequest: TeamAccession,
  teamId: number,
  token: string,
): Promise<Success | Error> => {
  return await teamAccessions
    .post<Success>(
      `/team/request/${teamId}`,
      teamRequest,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { responseData: { success: 'Успешная отправка заявки' } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка отправки заявления'
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
      `/team/update/${id}`,
      team,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка обновления команды'
      return new Error(error)
    })
}

const responseToRequest = async (
  teamRequest: TeamAccession,
  token: string,
): Promise<Success | Error> => {
  return await teamAccessions
    .put<Success>(
      `/team/response-to-request/${teamRequest.id}`,
      teamRequest,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
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

const responseToInvitation = async (
  teamRequest: TeamAccession,
  token: string,
): Promise<Success | Error> => {
  return await teamAccessions
    .put<Success>(
      `/team/response-to-invitation/${teamRequest.id}`,
      teamRequest,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
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

const kickMember = async (
  member: TeamMember,
  teamId: number,
  token: string,
): Promise<Success | Error> => {
  return await teamMemberAxios
    .put<Success>(
      `/team/kick/${teamId}`,
      member,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id: teamId } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка кика пользователя'
      return new Error(error)
    })
}

const deleteTeam = async (id: number, token: string): Promise<Success | Error> => {
  return await teamsAxios
    .delete(
      `/team/delete/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { responseData: { success: 'Успешное удаление' }, params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка удаления команды'
      return new Error(error)
    })
}

const deleteTeamAccession = async (
  id: number,
  token: string,
): Promise<Success | Error> => {
  return await teamAccessions
    .delete(
      `/team/accession/delete/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { responseData: { success: 'Успешное удаление' }, params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка'
      return new Error(error)
    })
}

const TeamService = {
  getTeams,
  getTeam,
  getTeamProfile,
  getAllTeamProfiles,
  getAllTeamAccessions,

  createTeam,
  inviteRegisteredUsers,
  inviteUnregisteredUsers,
  sendRequest,

  kickMember,
  updateTeam,
  responseToRequest,
  responseToInvitation,

  deleteTeam,
  deleteTeamAccession,
}

export default TeamService
