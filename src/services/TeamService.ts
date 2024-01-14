import axios from 'axios'

import { API_URL, MODE } from '@Main'

import {
  RequestToTeam,
  Team,
  TeamInvitation,
  TeamMember,
  JoinStatus,
  TeamExperience,
} from '@Domain/Team'
import { Skill } from '@Domain/Skill'
import RolesTypes from '@Domain/Roles'
import Success from '@Domain/ResponseMessage'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import {
  RequestTeamsMocks,
  profilesMocks,
  requestsToTeamMocks,
  teamInvitationsMocks,
  teamMembersMocks,
  teamsMocks,
} from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'
import handleAxiosError from '@Utils/handleAxiosError'
import { RequestTeamToIdea } from '@Domain/RequestTeamToIdea'

const teamsAxios = defineAxios(teamsMocks)
const teamMemberAxios = defineAxios(teamMembersMocks)
const teamInvitationsAxios = defineAxios(teamInvitationsMocks)
const requestsToTeamAxios = defineAxios(requestsToTeamMocks)
const requestTeamsAxios = defineAxios(RequestTeamsMocks)

function leaveFromTeamTeamMember(teamId: string, teamMemberId: string) {
  teamsMocks.forEach((team) => {
    if (team.id === teamId) {
      team.members = team.members.filter(
        (teamMember) => teamMember.id !== teamMemberId,
      )
    }
  })
}

function finishTeamExperience(teamId: string, teamMemberId: string) {
  const currentProfile = profilesMocks.find(({ id }) => id === teamMemberId)
  const currentTeamExperience = currentProfile?.teamsExperience.find(
    (experience) => experience.teamId === teamId && experience.finishDate === null,
  )
  const currentTeamProject = currentProfile?.teamsProjects.find(
    (project) => project.teamId === teamId && project.finishDate === null,
  )

  if (currentTeamExperience) {
    const currentDate = new Date().toJSON().toString()
    currentTeamExperience.finishDate = currentDate
    if (currentTeamProject) currentTeamProject.finishDate = currentDate
  }
}

function addTeamExperince(userId: string, teamId: string) {
  const currentProfile = profilesMocks.find(({ id }) => id === userId)
  const currentTeam = teamsMocks.find((team) => team.id === teamId)

  if (currentTeam && currentProfile) {
    const newTeamExperience: TeamExperience = {
      teamId: currentTeam.id,
      teamName: currentTeam.name,
      userId: userId,
      firstName: '',
      lastName: '',
      startDate: new Date().toJSON().toString(),
      finishDate: null,
      hasActiveProject: false,
    }

    currentProfile.teamsExperience.push(newTeamExperience)
  }
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

// --- GET --- //
const getTeams = async (token: string): Promise<Team[] | Error> => {
  return teamsAxios
    .get(`/team/all`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения команд'))
}

const getOwnerTeams = async (
  ideaMarketId: string,
  token: string,
): Promise<Team[] | Error> => {
  return teamsAxios
    .get(`/team/owner/all/${ideaMarketId}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения команд'))
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
    .catch((error) => handleAxiosError(error, 'Ошибка получения команды'))
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
    .catch((error) => handleAxiosError(error, 'Ошибка получения приглашений'))
}

const getRequestsToTeam = async (
  teamId: string,
  token: string,
): Promise<RequestToTeam[] | Error> => {
  return requestsToTeamAxios
    .get<RequestToTeam[]>(
      `/team/users/requests/${teamId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {
        formatter: (requests) => formatRequestsToTeamByTeamId(requests, teamId),
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения заявок'))
}

const getTeamRequestsToIdeas = async (
  teamId: string,
  token: string,
): Promise<RequestTeamToIdea[] | Error> => {
  return requestTeamsAxios
    .get(`/team/idea/requests/${teamId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения заявок'))
}

const getAllUsersInTeams = async (token: string): Promise<TeamMember[] | Error> => {
  return teamMemberAxios
    .get(`/team/users/consist`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) =>
      handleAxiosError(error, 'Ошибка получения пользователей в команде'),
    )
}

// --- POST --- //
const createTeam = async (team: Team, token: string): Promise<Team | Error> => {
  return teamsAxios
    .post(`/team/add`, team, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка создания команды'))
}

const createInvitationsToTeam = async (
  invitationsToTeam: TeamInvitation[],
  token: string,
): Promise<TeamInvitation[] | Error> => {
  if (MODE === 'DEVELOPMENT') {
    invitationsToTeam.forEach((invitation) => (invitation.status = 'NEW'))
  }

  return teamInvitationsAxios
    .post(`/team/send-invites`, invitationsToTeam, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка приглашения участников'))
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
    .catch((error) => handleAxiosError(error, 'Ошибка подачи заявки'))
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
    .catch((error) => handleAxiosError(error, 'Ошибка добавления участника'))
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
    .catch((error) => handleAxiosError(error, 'Ошибка фильтрации команд'))
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
    .catch((error) => handleAxiosError(error, 'Ошибка фильтрации команд'))
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
    .catch((error) => handleAxiosError(error, 'Ошибка обновления команды'))
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
    .catch((error) => handleAxiosError(error, 'Ошибка назначения лидера'))
}

const updateRequestToTeamStatus = async (
  requestId: string,
  teamId: string,
  userId: string,
  status: JoinStatus,
  token: string,
): Promise<RequestToTeam | Error> => {
  if (MODE === 'DEVELOPMENT') {
    setRequestsAndInvitationsAnnulled(userId, requestId, null)

    if (status === 'ACCEPTED') addTeamExperince(userId, teamId)
  }

  return requestsToTeamAxios
    .put<RequestToTeam>(
      `/team/request/${requestId}/update/${status}`,
      { status: status },
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id: requestId } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка изменения статуса заявки'))
}

const updateInvitationToTeamStatus = async (
  id: string,
  userId: string,
  status: JoinStatus,
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
    .catch((error) =>
      handleAxiosError(error, 'Ошибка изменения статуса приглашения'),
    )
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
    .catch((error) => handleAxiosError(error, 'Ошибка удаления команды'))
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
    .catch((error) => handleAxiosError(error, 'Ошибка исключения участника команды'))
}

const leaveFromTeam = async (
  teamId: string,
  teamMemberId: string,
  token: string,
): Promise<Success | Error> => {
  if (MODE === 'DEVELOPMENT') {
    leaveFromTeamTeamMember(teamId, teamMemberId)
    finishTeamExperience(teamId, teamMemberId)
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
    .catch((error) => handleAxiosError(error, 'Ошибка выхода из команды'))
}

const TeamService = {
  getTeams,
  getOwnerTeams,
  getTeam,
  getTeamInvitations,
  getRequestsToTeam,
  getTeamRequestsToIdeas,
  getAllUsersInTeams,

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
