import axios from 'axios'

import { API_URL } from '@Main'

import { User } from '@Domain/User'
import { UpdateUserPassword } from '@Domain/ManageUsers'
import { NewEmailForm } from '@Domain/Invitation'
import Success from '@Domain/ResponseMessage'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'

const usersAxios = defineAxios(getMocks().users)
const usersEmailsAxios = defineAxios(getMocks().usersEmails)

const getUsers = async (token: string): Promise<User[] | Error> => {
  return await usersAxios
    .get('/profile/get/users', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки пользователей'
      return new Error(error)
    })
}

const getUsersEmails = async (token: string): Promise<string[] | Error> => {
  return await usersEmailsAxios
    .get(`/profile/get/emails`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки почт'
      return new Error(error)
    })
}

const updateUserInfo = async (
  newUserData: User,
  token: string,
): Promise<User | Error> => {
  return await usersAxios
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
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка обновления пользователя'
      return new Error(error)
    })
}

const updateUserPassword = async (
  newPasswordData: UpdateUserPassword,
): Promise<Success | Error> => {
  return await axios
    .put(`${API_URL}/profile/change/password`, newPasswordData)
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка обновления пароля'
      return new Error(error)
    })
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
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка обновления почты'
      return new Error(error)
    })
}

const ManageUsersService = {
  getUsers,
  getUsersEmails,
  updateUserInfo,
  updateUserPassword,
  updateUserEmail,
}

export default ManageUsersService
