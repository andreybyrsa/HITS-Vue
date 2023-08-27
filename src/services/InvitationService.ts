import axios from 'axios'

import {
  InviteUserForm,
  InviteUsersForm,
  InvitationInfo,
  RecoveryData,
  NewEmailForm,
} from '@Domain/Invitation'

import Success from '@Domain/ResponseMessage'

const INVITATION_URL =
  process.env.VUE_APP_INVITATION_API_URL || 'http://localhost:3000'

const inviteUserByEmail = async (
  userData: InviteUserForm,
  token: string,
): Promise<Success | Error> => {
  return await axios
    .post(`${INVITATION_URL}/send/email`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка приглашения пользователя'
      return new Error(error)
    })
}

const inviteUsers = async (
  usersData: InviteUsersForm,
  token: string,
): Promise<Success | Error> => {
  return await axios
    .post(`${INVITATION_URL}/send/emails`, usersData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка приглашения пользователей'
      return new Error(error)
    })
}

const sendRecoveryEmail = async (
  recoveryData: RecoveryData,
): Promise<{ key: string } | Error> => {
  return await axios
    .post(`${INVITATION_URL}/send/request-to-change-password`, recoveryData)
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка отпрваки почты'
      return new Error(error)
    })
}

const getInvitationInfo = async (
  slug: string | string[],
): Promise<InvitationInfo | Error> => {
  return await axios
    .get(`${INVITATION_URL}/get/invitation/${slug}`)
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка приглашения'
      return new Error(error)
    })
}

const deleteInvitationInfo = async (slug: string | string[]) => {
  return await axios
    .delete(`${INVITATION_URL}/delete/invitation/${slug}`)
    .catch<Error>(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка удаления приглашения'
      return new Error(error)
    })
}

const sendUrlToChangeEmail = async (
  userData: NewEmailForm,
  token: string,
): Promise<Success | Error> => {
  return await axios
    .post(`${INVITATION_URL}/send/request-to-change-email`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка отправки ссылки для смены почты'
      return new Error(error)
    })
}

const getInfoToChangeEmail = async (
  slug: string | string[],
  token: string,
): Promise<NewEmailForm | Error> => {
  return await axios
    .get(`${INVITATION_URL}/change/email/${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка приглашения'
      return new Error(error)
    })
}
const InvitationService = {
  inviteUserByEmail,
  inviteUsers,
  sendRecoveryEmail,
  getInvitationInfo,
  deleteInvitationInfo,
  sendUrlToChangeEmail,
  getInfoToChangeEmail,
}

export default InvitationService
