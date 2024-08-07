import axios from 'axios'

import { InviteUserForm, InviteUsersForm, NewEmailForm } from '@Domain/Invitation'
import Success from '@Domain/ResponseMessage'

import useUserStore from '@Store/user/userStore'

import getAbortedSignal from '@Utils/getAbortedSignal'
import handleAxiosError from '@Utils/handleAxiosError'

const inviteUserByEmail = async (
  userData: InviteUserForm,
  token: string,
): Promise<Success | Error> => {
  return axios
    .post(`/api/v1/authorization-service/invitation/send/email`, userData, {
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
    .post(`/api/v1/authorization-service/invitation/send/many`, usersData, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка приглашения пользователей'))
}

const sendUrlToChangeEmail = async (
  token: string,
  newEmail: string,
): Promise<Success | Error> => {
  return axios
    .post(
      `/api/v1/authorization-service/account/code/change/email/${newEmail}`,
      newEmail,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    .then((response) => response.data)
    .catch((error) =>
      handleAxiosError(error, 'Ошибка отправки ссылки для смены почты'),
    )
}

const InvitationService = {
  inviteUserByEmail,
  inviteUsers,
  sendUrlToChangeEmail,
}

export default InvitationService
