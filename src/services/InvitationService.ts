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
import handleAxiosError from '@Utils/handleAxiosError'

const getInvitationInfo = async (
  slug: string | string[],
): Promise<InvitationInfo | Error> => {
  return axios
    .get(`${API_URL}/ideas-service/profile/get/invitation/${slug}`)
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка приглашения'))
}

const getInfoToChangeEmail = async (
  slug: string | string[],
  token: string,
): Promise<NewEmailForm | Error> => {
  return axios
    .get(`${API_URL}/ideas-service/profile/change/email/${slug}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка приглашения'))
}

const inviteUserByEmail = async (
  userData: InviteUserForm,
  token: string,
): Promise<Success | Error> => {
  return axios
    .post(`${API_URL}/ideas-service/profile/send/email`, userData, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка приглашения пользователя'))
}

const inviteUsers = async (
  usersData: InviteUsersForm,
  token: string,
): Promise<Success | Error> => {
  return axios
    .post(`${API_URL}/ideas-service/profile/send/emails`, usersData, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка приглашения пользователей'))
}

const sendRecoveryEmail = async (
  recoveryData: RecoveryData,
): Promise<string | Error> => {
  return axios
    .post(`${API_URL}/ideas-service/profile/send/change/password`, recoveryData)
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка отправки почты'))
}

const sendUrlToChangeEmail = async (
  userData: NewEmailForm,
  token: string,
): Promise<Success | Error> => {
  return axios
    .post(`${API_URL}/ideas-service/profile/send/change/email`, userData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) =>
      handleAxiosError(error, 'Ошибка отправки ссылки для смены почты'),
    )
}

const deleteInvitationInfo = async (slug: string | string[]) => {
  return axios
    .delete(`${API_URL}/ideas-service/profile/delete/invitation/${slug}`)
    .catch<Error>((error) => handleAxiosError(error, 'Ошибка удаления приглашения'))
}

const InvitationService = {
  getInvitationInfo,
  getInfoToChangeEmail,

  inviteUserByEmail,
  inviteUsers,
  sendRecoveryEmail,
  sendUrlToChangeEmail,

  deleteInvitationInfo,
}

export default InvitationService
