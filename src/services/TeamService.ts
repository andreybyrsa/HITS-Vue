import { api } from '@Api'
import { MODE } from '@Main'
import {
  RequestToTeam,
  Team,
  TeamInvitation,
  TeamMember,
  JoinStatus,
} from '@Domain/Team'
import { Skill } from '@Domain/Skill'
import RolesTypes from '@Domain/Roles'
import Success from '@Domain/ResponseMessage'
import {
  RequestTeamsMocks,
  requestsToTeamMocks,
  teamInvitationsMocks,
  teamMembersMocks,
  teamsMocks,
} from '@Utils/getMocks'
import { RequestTeamToIdea } from '@Domain/RequestTeamToIdea'
import defineAxios from '@Utils/defineAxios'

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
const getTeams = async (): Promise<Team[] | Error> => {
  const response = await teamsAxios.get('/team/all')
  return response.data
}

const getOwnerTeams = async (ideaMarketId: string): Promise<Team[] | Error> => {
  const response = await teamsAxios.get(`/team/owner/all/${ideaMarketId}`)
  return response.data
}

const getTeam = async (id: string): Promise<Team | Error> => {
  const response = await teamsAxios.get(`/team/${id}`, {}, { params: { id } })
  return response.data
}

const getTeamInvitations = async (
  teamId: string,
): Promise<TeamInvitation[] | Error> => {
  const response = await teamInvitationsAxios.get<TeamInvitation[]>(
    `/team/invitations/${teamId}`,
    {},
    {
      formatter: (invitations) => formatTeamInvitationsByTeamId(invitations, teamId),
    },
  )
  return response.data
}

const getRequestsToTeam = async (
  teamId: string,
): Promise<RequestToTeam[] | Error> => {
  const response = await requestsToTeamAxios.get<RequestToTeam[]>(
    `/team/users/requests/${teamId}`,
    {},
    {
      formatter: (requests) => formatRequestsToTeamByTeamId(requests, teamId),
    },
  )
  return response.data
}

const getTeamRequestsToIdeas = async (
  teamId: string,
): Promise<RequestTeamToIdea[] | Error> => {
  const response = await requestTeamsAxios.get(`/team/idea/requests/${teamId}`, {})
  return response.data
}

const getAllUsersInTeams = async (): Promise<TeamMember[] | Error> => {
  const response = await teamMemberAxios.get('/team/users/consist')
  return response.data
}

const createTeam = async (team: Team): Promise<Team | Error> => {
  const response = await teamsAxios.post('/team/add', team)
  return response.data
}

const createInvitationsToTeam = async (
  invitationsToTeam: TeamInvitation[],
): Promise<TeamInvitation[] | Error> => {
  if (MODE === 'DEVELOPMENT') {
    invitationsToTeam.forEach((invitation) => (invitation.status = 'NEW'))
  }

  const response = await teamInvitationsAxios.post(
    '/team/send-invites',
    invitationsToTeam,
  )
  return response.data
}

const createRequestToTeam = async (
  requestToTeam: RequestToTeam,
): Promise<RequestToTeam | Error> => {
  const response = await requestsToTeamAxios.postNoRequestBody<RequestToTeam>(
    `/team/request/send/${requestToTeam.teamId}`,
    {},
    { requestData: requestToTeam },
  )
  return response.data
}

const addTeamMember = async (
  teamMember: TeamMember,
): Promise<TeamMember | Error> => {
  if (MODE === 'DEVELOPMENT') {
    const teams = teamsAxios.getReactiveMocks()

    teams.value.forEach((team) => {
      if (team.id === teamMember.teamId) {
        team.members.push(teamMember)
      }
    })
  }

  const response = await teamMemberAxios.postNoRequestBody<TeamMember>(
    `/team/invite/${teamMember.teamId}/${teamMember.userId}`,
    {},
    { requestData: teamMember },
  )
  return response.data
}

const filterBySkillsAndRole = async (
  skills: Skill[],
  role: RolesTypes,
): Promise<Team[] | Error> => {
  const response = await api.post(`/team/skill-filter/${role}`, skills)
  return response.data
}

const filterByVacancies = async (skills: Skill[]): Promise<Team[] | Error> => {
  const response = await api.post('/team/vacancy-filter', skills)
  return response.data
}

const updateTeam = async (team: Team, id: string): Promise<Team | Error> => {
  const response = await teamsAxios.put<Team>(
    `/team/update/${id}`,
    team,
    {},
    { params: { id } },
  )
  return response.data
}

const appointLeaderTeam = async (
  teamId: string,
  teamMember: TeamMember,
): Promise<Success | Error> => {
  const response = await teamsAxios.putNoRequestBody<Success>(
    `/team/change/leader/${teamId}/${teamMember.id}`,
    {},
    { params: { id: teamId }, requestData: { leader: teamMember } },
  )
  return response.data
}

const updateRequestToTeamStatus = async (
  requestId: string,
  teamId: string,
  userId: string,
  status: JoinStatus,
): Promise<RequestToTeam | Error> => {
  if (MODE === 'DEVELOPMENT') {
    setRequestsAndInvitationsAnnulled(userId, requestId, null)
  }

  const response = await requestsToTeamAxios.put<RequestToTeam>(
    `/team/request/${requestId}/update/${status}`,
    { status: status },
    {},
    { params: { id: requestId } },
  )
  return response.data
}

const updateInvitationToTeamStatus = async (
  id: string,
  userId: string,
  status: JoinStatus,
): Promise<TeamInvitation | Error> => {
  if (MODE === 'DEVELOPMENT') {
    setRequestsAndInvitationsAnnulled(userId, null, id)
  }

  const response = await teamInvitationsAxios.put<TeamInvitation>(
    `/team/invitation/${id}/update/${status}`,
    { status: status },
    {},
    { params: { id } },
  )
  return response.data
}

const deleteTeam = async (id: string): Promise<Success | Error> => {
  const response = await teamsAxios.delete(
    `/team/delete/${id}`,
    {},
    { params: { id }, responseData: { success: 'Успешное удаление' } },
  )
  return response.data
}

const kickTeamMember = async (
  teamId: string,
  teamMemberId: string,
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

  const response = await teamMemberAxios.delete(
    `/team/kick/${teamId}/${teamMemberId}`,
    {},
    { params: { id: teamMemberId } },
  )
  return response.data
}

const leaveFromTeam = async (
  teamId: string,
  teamMemberId: string,
): Promise<Success | Error> => {
  if (MODE === 'DEVELOPMENT') {
    leaveFromTeamTeamMember(teamId, teamMemberId)
  }

  const response = await teamMemberAxios.delete(
    `/team/leave/${teamId}`,
    {},
    { params: { id: teamMemberId } },
  )
  return response.data
}

export const TeamService = {
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
