import axios from 'axios'

import { User } from '@Domain/User'
import { UpdateUserData, UpdateUserPassword } from '@Domain/ManageUsers'
import { NewEmailForm } from '@Domain/Invitation'
import Success from '@Domain/ResponseMessage'
const MANAGE_USERS_URL =
  process.env.VUE_APP_MANAGE_USERS_API_URL || 'http://localhost:3000'

const getUsers = async (token: string): Promise<{ users: User[] } | Error> => {
  return await axios
    .get(`${MANAGE_USERS_URL}/get/users-info`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки пользователей'
      return new Error(error)
    })
}

const getUsersEmails = async (
  token: string,
): Promise<{ emails: string[] } | Error> => {
  return await axios
    .get(`${MANAGE_USERS_URL}/get/users-emails`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка загрузки почт'
      return new Error(error)
    })
}

const updateUserInfo = async (
  newUserData: UpdateUserData,
  token: string,
): Promise<Success | Error> => {
  return await axios
    .put(`${MANAGE_USERS_URL}/change/user-info`, newUserData, {
      headers: { Authorization: `Bearer ${token}` },
    })
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
    .put(`${MANAGE_USERS_URL}/change/password`, newPasswordData)
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
    .put(`${MANAGE_USERS_URL}/change/email`, newEmailData, {
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
