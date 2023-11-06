import axios from 'axios'

import { API_URL } from '@Main'

import {
  InviteUserForm,
  InviteUsersForm,
  InvitationInfo,
  RecoveryData,
  NewEmailForm,
} from '@Domain/Invitation'
import Success from '@Domain/ResponseMessage'

import useUserStore from '@Store/user/userStore'

import getAbortedSignal from '@Utils/getAbortedSignal'

const getInvitationInfo = async (
  slug: string | string[],
): Promise<InvitationInfo | Error> => {
  return await axios
    .get(`${API_URL}/profile/get/invitation/${slug}`)
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка приглашения'
      return new Error(error)
    })
}

const deleteInvitationInfo = async (slug: string | string[]) => {
  return await axios
    .delete(`${API_URL}/profile/delete/invitation/${slug}`)
    .catch<Error>(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка удаления приглашения'
      return new Error(error)
    })
}

const inviteUserByEmail = async (
  userData: InviteUserForm,
  token: string,
): Promise<Success | Error> => {
  return await axios
    .post(`${API_URL}/profile/send/email`, userData, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
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
    .post(`${API_URL}/profile/send/emails`, usersData, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка приглашения пользователей'
      return new Error(error)
    })
}

const sendRecoveryEmail = async (
  recoveryData: RecoveryData,
): Promise<string | Error> => {
  return await axios
    .post(`${API_URL}/profile/send/change/password`, recoveryData)
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка отпрваки почты'
      return new Error(error)
    })
}

const sendUrlToChangeEmail = async (
  userData: NewEmailForm,
  token: string,
): Promise<Success | Error> => {
  return await axios
    .post(`${API_URL}/profile/send/change/email`, userData, {
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
    .get(`${API_URL}/profile/change/email/${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка приглашения'
      return new Error(error)
    })
}

const InvitationService = {
  getInvitationInfo,
  deleteInvitationInfo,

  inviteUserByEmail,
  inviteUsers,
  sendRecoveryEmail,
  sendUrlToChangeEmail,
  getInfoToChangeEmail,
}

export default InvitationService
