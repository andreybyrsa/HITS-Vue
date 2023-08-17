import axios from 'axios'

import { User } from '@Domain/User'
import {
  UpdateUserData,
  UpdateUserPassword,
  ChangeUserEmail,
} from '@Domain/ManageUsers'
import ResponseMessage from '@Domain/ResponseMessage'

const MANAGE_USERS_URL =
  process.env.VUE_APP_MANAGE_USERS_API_URL || 'http://localhost:3000'

const getUsers = async (
  token: string,
): Promise<{ users: User[] } & ResponseMessage> => {
  return await axios
    .get(`${MANAGE_USERS_URL}/get/users-info`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response
        ? response.data.error
        : 'Ошибка загрузки пользователей'
      return { error }
    })
}

const updateUserInfo = async (
  newUserData: UpdateUserData,
  token: string,
): Promise<ResponseMessage> => {
  return await axios
    .put(`${MANAGE_USERS_URL}/change/user-info`, newUserData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response
        ? response.data.error
        : 'Ошибка обновления пользователя'
      return { error }
    })
}

const updateUserPassword = async (
  newPasswordData: UpdateUserPassword,
): Promise<ResponseMessage> => {
  return axios
    .put(`${MANAGE_USERS_URL}/change/password`, newPasswordData)
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response ? response.data.error : 'Ошибка обновления пароля'
      return { error }
    })
}

const updateUserEmail = async (
  newEmailData: ChangeUserEmail,
): Promise<ResponseMessage> => {
  return axios
    .put(`${MANAGE_USERS_URL}/change/email`, newEmailData)
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response ? response.data.error : 'Ошибка изменения почты'
      return { error }
    })
}

const ManageUsersService = {
  getUsers,
  updateUserInfo,
  updateUserPassword,
  updateUserEmail,
}

export default ManageUsersService
