import Team from '@Domain/Team'
import Success from '@Domain/ResponseMessage'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import TeamMember from '@Domain/TeamMember'
import { TeamAccession } from '@Domain/TeamAccession'

const teamsAxios = defineAxios(getMocks().teams)
const teamMemberAxios = defineAxios(getMocks().teamMember)
const teamAccessions = defineAxios(getMocks().teamAccessions)
const teamRequests = defineAxios(getMocks().teamRequests)
const unregisteredInvitations = defineAxios(getMocks().unregisteredInvitations)
const registeredInvitations = defineAxios(getMocks().registeredInvitations)

const getTeams = async (token: string): Promise<Team[] | Error> => {
  return await teamsAxios
    .get(`/team/all `, {
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
      `/team/${id}`,
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
    .post(`/team/add`, team, {
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
      `/team/update/${id}`,
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
      `/team/delete/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      { responseData: { success: 'Успешное приглашение новых пользователей' } },
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
      `/team/kick/${teamId}`,
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
      `/team/accession/delete/${id}`,
      { headers: { Authorization: `Bearer ${token}` } },
      { responseData: { success: 'Успешное удаление' } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка'
      return new Error(error)
    })
}

const invitePortalUsers = async (
  emails: string[],
  teamId: number,
  token: string,
): Promise<Success | Error> => {
  return await registeredInvitations
    .post<Success>(
      `/team/send-invite/${teamId}`,
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

const inviteOutsideUsers = async (
  emails: string[],
  teamId: number,
  token: string,
): Promise<Success | Error> => {
  return await unregisteredInvitations
    .post<Success>(
      `/team/send-invite-unregistered/${teamId}`,
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
    .get(`/team/invitations/${teamId}`, {
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
      `/team/request/${id}`,
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
      `/team/request/${teamId}`,
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

const rejectRequest = async (
  requestId: number,
  token: string,
): Promise<Success | Error> => {
  return await teamAccessions
    .delete(
      `reject-request/${requestId}`,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { id: `${requestId}` } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Не удалось отклонить заявку'
      return Error(error)
    })
}

const acceptRequest = async (
  requestId: number,
  token: string,
): Promise<Success | Error> => {
  return await teamAccessions
    .delete(
      `accept-request/${requestId}`,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { id: `${requestId}` } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Не удалось принять заявку'
      return Error(error)
    })
}
const TeamService = {
  getTeams,
  getTeam,
  createTeam,
  invitePortalUsers,
  inviteOutsideUsers,
  deleteTeamAccession,
  fetchInvitationsAndRequestions,
  kickMember,
  updateTeam,
  deleteTeam,
  sendRequest,
  getTeamRequest,
  rejectRequest,
  acceptRequest,
}

export default TeamService
