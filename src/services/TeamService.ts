import {
  RequestToTeam,
  Team,
  TeamInvitation,
  TeamMember,
  TeamSkills,
  RequestToTeamStatus,
} from '@Domain/Team'
import Success from '@Domain/ResponseMessage'

import useUserStore from '@Store/user/userStore'

import { API_URL } from '@Main'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'
import axios from 'axios'
import { User } from '@Domain/User'

function getTeamInvitationsByTeamId(invitations: TeamInvitation[], teamId: string) {
  return invitations.filter((invitation) => invitation.teamId === teamId)
}

function getRequestsToTeamByTeamId(requests: RequestToTeam[], teamId: string) {
  return requests.filter((request) => request.teamId === teamId)
}

const teamsAxios = defineAxios(getMocks().teams)
const teamMemberAxios = defineAxios(getMocks().teamMembers)
const teamInvitationsAxios = defineAxios(getMocks().teamInvitations)
const requestsToTeamAxios = defineAxios(getMocks().requestsToTeam)
const teamSkillsAxios = defineAxios(getMocks().teamSkills)

const getTeams = async (token: string): Promise<Team[] | Error> => {
  return await teamsAxios
    .get(`/team/all`, {
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
    .get('/team/members/all', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения участников команды'
      return new Error(error)
    })
}

const getTeamInvitations = async (
  teamId: string,
  token: string,
): Promise<TeamInvitation[] | Error> => {
  return await teamInvitationsAxios
    .get<TeamInvitation[]>(
      `/team/invitations/${teamId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        formatter: (invitations) => getTeamInvitationsByTeamId(invitations, teamId),
      },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения приглашений'
      return new Error(error)
    })
}

const getRequestsToTeam = async (
  teamId: string,
  token: string,
): Promise<RequestToTeam[] | Error> => {
  return await requestsToTeamAxios
    .get<RequestToTeam[]>(
      `/team/requests/${teamId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        formatter: (requests) => getRequestsToTeamByTeamId(requests, teamId),
      },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения заявок'
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

const createTeamSkills = async (
  wantedSkills: TeamSkills,
  teamId: string,
  token: string,
): Promise<TeamSkills | Error> => {
  return await teamSkillsAxios
    .post(`/skills/create/${teamId}`, wantedSkills, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка добавления компетенций команды'
      return new Error(error)
    })
}

const invitationTeamMember = async (
  users: User[],
  teamId: string,
  token: string,
): Promise<TeamInvitation[] | Error> => {
  return await axios
    .post(`${API_URL}/team/send-invites/${teamId}`, users, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка приглашения участника'
      return new Error(error)
    })
}

const sendRequestInTeam = async (
  userId: string,
  teamId: string,
  token: string,
): Promise<RequestToTeam | Error> => {
  return await axios
    .post(`${API_URL}/team/request/send/${teamId}/${userId}`, null, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка подачи заявки'
      return new Error(error)
    })
}

const addTeamMember = async (
  teamMember: TeamMember,
  token: string,
): Promise<TeamMember | Error> => {
  return await teamMemberAxios
    .post(`/team/members/add`, teamMember, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка добавления участника'
      return new Error(error)
    })
}

const updateTeam = async (
  team: Team,
  id: string,
  token: string,
): Promise<Team | Error> => {
  return await teamsAxios
    .put<Team>(
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

const updateTeamSkills = async (
  teamId: string,
  wantedSkills: TeamSkills,
  token: string,
): Promise<TeamSkills | Error> => {
  return await teamSkillsAxios
    .put(
      '/team/skills/update',
      wantedSkills,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { teamId } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка обновления компетенций команды'
      return new Error(error)
    })
}

const updateRequestToTeamStatus = async (
  id: string,
  status: RequestToTeamStatus,
  token: string,
): Promise<Success | Error> => {
  return await requestsToTeamAxios
    .put<Success>(
      `/team/request/${id}/update/${status}`,
      { status: status },
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id }, responseData: { success: 'Успешное удаление' } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка изменения статуса заявки'
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
      { responseData: { success: 'Успешное удаление' }, params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка удаления команды'
      return new Error(error)
    })
}

const kickTeamMember = async (
  teamMemberId: string,
  token: string,
): Promise<Success | Error> => {
  return await teamMemberAxios
    .delete(
      `/team/members/add`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { userId: teamMemberId } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка исключения участника команды'
      return new Error(error)
    })
}

const TeamService = {
  getTeams,
  getTeam,
  getTeamMembers,
  getTeamInvitations,
  getRequestsToTeam,
  getTeamSkills,

  createTeam,
  createTeamSkills,
  addTeamMember,
  invitationTeamMember,
  sendRequestInTeam,

  updateTeam,
  updateTeamSkills,
  updateRequestToTeamStatus,

  deleteTeam,
  kickTeamMember,
}

export default TeamService
