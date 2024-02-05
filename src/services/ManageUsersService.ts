import axios from 'axios'

import { API_URL } from '@Main'

import { User } from '@Domain/User'
import { UpdateUserPassword } from '@Domain/ManageUsers'
import { NewEmailForm } from '@Domain/Invitation'
import Success from '@Domain/ResponseMessage'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import handleAxiosError from '@Utils/handleAxiosError'
import { usersEmailsMocks, usersMocks } from '@Utils/getMocks'

const usersAxios = defineAxios(usersMocks)
const usersEmailsAxios = defineAxios(usersEmailsMocks)

const getUsers = async (token: string): Promise<User[] | Error> => {
  return usersAxios
    .get('/profile/get/users', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки пользователей'))
}

const getUsersEmails = async (token: string): Promise<string[] | Error> => {
  return usersEmailsAxios
    .get(`/profile/get/emails`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки почт'))
}

const updateUserInfo = async (
  newUserData: User,
  token: string,
): Promise<User | Error> => {
  return usersAxios
    .put(
      '/profile/change/info',
      newUserData,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id: newUserData.id } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка обновления пользователя'))
}

const updateUserPassword = async (
  newPasswordData: UpdateUserPassword,
): Promise<Success | Error> => {
  return axios
    .put(`${API_URL}/profile/change/password`, newPasswordData)
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка обновления пароля'))
}

const updateUserEmail = async (
  newEmailData: NewEmailForm,
  token: string,
): Promise<Success | Error> => {
  return axios
    .put(`${API_URL}/profile/change/email`, newEmailData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка обновления почты'))
}

const ManageUsersService = {
  getUsers,
  getUsersEmails,

  updateUserInfo,
  updateUserPassword,
  updateUserEmail,
}

export default ManageUsersService
