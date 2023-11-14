import Success from '@Domain/ResponseMessage'
import { TeamAccession } from '@Domain/TeamAccession'
import TeamMember from '@Domain/TeamMember'
import useUserStore from '@Store/user/userStore'
import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import getMocks from '@Utils/getMocks'

const teamMemberAxios = defineAxios(getMocks().teamMember)
const teamAccessions = defineAxios(getMocks().teamAccessions)
const unregisteredInvitations = defineAxios(getMocks().unregisteredInvitations)
const registeredInvitations = defineAxios(getMocks().registeredInvitations)

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
  userId: number,
  token: string,
): Promise<TeamMember | Error> => {
  return teamMemberAxios
    .get(
      `/team/profile/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { userId } },
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
    .get(`/team/accessions/${teamId}`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки приглашений и заявок'
      return new Error(error)
    })
}

const getUserTeamAccessions = async (
  token: string,
): Promise<TeamAccession[] | Error> => {
  return await teamAccessions
    .get(`/team/user-accessions/`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки приглашений и заявок'
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
      { params: { id }, responseData: { success: 'Успешное удаление' } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка'
      return new Error(error)
    })
}

const TeamAccessionsService = {
  getAllTeamAccessions,
  getAllTeamProfiles,
  getTeamProfile,
  getUserTeamAccessions,

  inviteRegisteredUsers,
  inviteUnregisteredUsers,
  sendRequest,

  responseToInvitation,
  responseToRequest,

  deleteTeamAccession,
}

export default TeamAccessionsService
