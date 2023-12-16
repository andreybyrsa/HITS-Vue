import axios from 'axios'

import { API_URL, MODE } from '@Main'

import {
  RequestToTeam,
  Team,
  TeamInvitation,
  TeamMember,
  RequestToTeamStatus,
  InvitationToTeamStatus,
} from '@Domain/Team'
import { Skill } from '@Domain/Skill'
import RolesTypes from '@Domain/Roles'
import Success from '@Domain/ResponseMessage'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'

function formatTeamsByOwner(teams: Team[], userId: string) {
  return teams.filter(({ owner }) => owner.id === userId)
}

function formatTeamInvitationsByTeamId(
  invitations: TeamInvitation[],
  teamId: string,
) {
  return invitations.filter((invitation) => invitation.teamId === teamId)
}

function formatRequestsToTeamByTeamId(requests: RequestToTeam[], teamId: string) {
  return requests.filter((request) => request.teamId === teamId)
}

function setRequestsAndInvitationsAnnulled(
  userId: string,
  requestId: string | null,
  invitationId: string | null,
) {
  const requests = requestsToTeamAxios.getReactiveMocks()
  const invitations = teamInvitationsAxios.getReactiveMocks()

  requests.value.forEach((request) => {
    if (request.userId === userId && request.status === 'NEW') {
      if (requestId) {
        return requestId !== request.id ? (request.status = 'ANNULLED') : null
      }

      request.status = 'ANNULLED'
    }
  })

  invitations.value.forEach((invitation) => {
    if (invitation.userId === userId && invitation.status === 'NEW') {
      if (invitationId) {
        return invitationId !== invitation.id
          ? (invitation.status = 'ANNULLED')
          : null
      }

      invitation.status = 'ANNULLED'
    }
  })
}

const teamsAxios = defineAxios(getMocks().teams)
const teamMemberAxios = defineAxios(getMocks().teamMembers)
const teamInvitationsAxios = defineAxios(getMocks().teamInvitations)
const requestsToTeamAxios = defineAxios(getMocks().requestsToTeam)

// --- GET --- //
const getTeams = async (token: string): Promise<Team[] | Error> => {
  return teamsAxios
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

const getOwnerTeams = async (
  userId: string,
  token: string,
): Promise<Team[] | Error> => {
  return teamsAxios
    .get<Team[]>(
      `/team/owner/all`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { formatter: (teams) => formatTeamsByOwner(teams, userId) },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения команд'
      return new Error(error)
    })
}

const getTeam = async (id: string, token: string): Promise<Team | Error> => {
  return teamsAxios
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

const getTeamInvitations = async (
  teamId: string,
  token: string,
): Promise<TeamInvitation[] | Error> => {
  return teamInvitationsAxios
    .get<TeamInvitation[]>(
      `/team/invitations/${teamId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        formatter: (invitations) =>
          formatTeamInvitationsByTeamId(invitations, teamId),
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
  return requestsToTeamAxios
    .get<RequestToTeam[]>(
      `/team/requests/${teamId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        formatter: (requests) => formatRequestsToTeamByTeamId(requests, teamId),
      },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения заявок'
      return new Error(error)
    })
}

// --- POST --- //
const createTeam = async (team: Team, token: string): Promise<Team | Error> => {
  return teamsAxios
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

const createInvitationsToTeam = async (
  invitationsToTeam: TeamInvitation[],
  teamId: string,
  token: string,
): Promise<TeamInvitation[] | Error> => {
  if (MODE === 'DEVELOPMENT') {
    invitationsToTeam.forEach((invitation) => (invitation.status = 'NEW'))
  }

  return teamInvitationsAxios
    .post(`/team/send-invites/${teamId}`, invitationsToTeam, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка приглашения участников'
      return new Error(error)
    })
}

const createRequestToTeam = async (
  requestToTeam: RequestToTeam,
  token: string,
): Promise<RequestToTeam | Error> => {
  return requestsToTeamAxios
    .postNoRequestBody<RequestToTeam>(
      `/team/request/send/${requestToTeam.teamId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { requestData: requestToTeam },
    )
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
  if (MODE === 'DEVELOPMENT') {
    const teams = teamsAxios.getReactiveMocks()

    teams.value.forEach((team) => {
      if (team.id === teamMember.teamId) {
        team.members.push(teamMember)
      }
    })
  }

  return teamMemberAxios
    .postNoRequestBody<TeamMember>(
      `/team/invite/${teamMember.teamId}/${teamMember.userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { requestData: teamMember },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка добавления участника'
      return new Error(error)
    })
}

const filterBySkillsAndRole = async (
  skills: Skill[],
  role: RolesTypes,
  token: string,
): Promise<Team[] | Error> => {
  return axios
    .post(`${API_URL}/team/skill-filter/${role}`, skills, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка фильтрации команд'
      return new Error(error)
    })
}

const filterByVacancies = async (
  skills: Skill[],
  token: string,
): Promise<Team[] | Error> => {
  return axios
    .post(`${API_URL}/team/vacancy-filter`, skills, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка фильтрации команд'
      return new Error(error)
    })
}

// --- PUT --- //
const updateTeam = async (
  team: Team,
  id: string,
  token: string,
): Promise<Team | Error> => {
  return teamsAxios
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

// const updateTeamSkills = async (
//   teamId: string,
//   wantedSkills: TeamSkills,
//   token: string,
// ): Promise<TeamSkills | Error> => {
//   return await teamSkillsAxios
//     .put(
//       '/team/skills/update',
//       wantedSkills,
//       {
//         headers: { Authorization: `Bearer ${token}` },
//         signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
//       },
//       { params: { teamId } },
//     )
//     .then((response) => response.data)
//     .catch(({ response }) => {
//       const error = response?.data?.error ?? 'Ошибка обновления компетенций команды'
//       return new Error(error)
//     })
// }

const appointLeaderTeam = async (
  teamId: string,
  teamMember: TeamMember,
  token: string,
): Promise<Success | Error> => {
  return teamsAxios
    .putNoRequestBody<Success>(
      `/team/change/leader/${teamId}/${teamMember.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id: teamId }, requestData: { leader: teamMember } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка назначения лидера'
      return new Error(error)
    })
}

const updateRequestToTeamStatus = async (
  id: string,
  userId: string,
  status: RequestToTeamStatus,
  token: string,
): Promise<RequestToTeam | Error> => {
  if (MODE === 'DEVELOPMENT') {
    setRequestsAndInvitationsAnnulled(userId, id, null)
  }

  return requestsToTeamAxios
    .put<RequestToTeam>(
      `/team/request/${id}/update/${status}`,
      { status: status },
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка изменения статуса заявки'
      return new Error(error)
    })
}

const updateInvitationToTeamStatus = async (
  id: string,
  userId: string,
  status: InvitationToTeamStatus,
  token: string,
): Promise<TeamInvitation | Error> => {
  if (MODE === 'DEVELOPMENT') {
    setRequestsAndInvitationsAnnulled(userId, null, id)
  }

  return teamInvitationsAxios
    .put<TeamInvitation>(
      `/team/invitation/${id}/update/${status}`,
      { status: status },
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка изменения статуса приглашения'
      return new Error(error)
    })
}

// --- DELETE --- //
const deleteTeam = async (id: string, token: string): Promise<Success | Error> => {
  return teamsAxios
    .delete(
      `/team/delete/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id }, responseData: { success: 'Успешное удаление' } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка удаления команды'
      return new Error(error)
    })
}

const kickTeamMember = async (
  teamId: string,
  teamMemberId: string,
  token: string,
): Promise<Success | Error> => {
  if (MODE === 'DEVELOPMENT') {
    const teams = teamsAxios.getReactiveMocks()
    teams.value.forEach((team) => {
      if (team.id === teamId) {
        team.members = team.members.filter(
          (teamMember) => teamMember.id !== teamMemberId,
        )
      }
    })
  }

  return teamMemberAxios
    .delete(
      `/team/kick/${teamId}/${teamMemberId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id: teamMemberId } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка исключения участника команды'
      return new Error(error)
    })
}

const leaveFromTeam = async (
  teamId: string,
  teamMemberId: string,
  token: string,
): Promise<Success | Error> => {
  if (MODE === 'DEVELOPMENT') {
    const teams = teamsAxios.getReactiveMocks()
    teams.value.forEach((team) => {
      if (team.id === teamId) {
        team.members = team.members.filter(
          (teamMember) => teamMember.id !== teamMemberId,
        )
      }
    })
  }

  return teamMemberAxios
    .delete(
      `/team/leave/${teamId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id: teamMemberId } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка выхода из команды'
      return new Error(error)
    })
}

const TeamService = {
  getTeams,
  getOwnerTeams,
  getTeam,
  getTeamInvitations,
  getRequestsToTeam,

  createTeam,
  addTeamMember,
  createInvitationsToTeam,
  createRequestToTeam,
  filterBySkillsAndRole,
  filterByVacancies,

  updateTeam,
  updateRequestToTeamStatus,
  updateInvitationToTeamStatus,
  appointLeaderTeam,

  deleteTeam,
  kickTeamMember,
  leaveFromTeam,
}

export default TeamService
