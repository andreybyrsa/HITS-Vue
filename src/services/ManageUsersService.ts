import axios from 'axios'

import { User } from '@Domain/User'
import { UpdateUserData } from '@Domain/ManageUsers'
import ResponseMessage from '@Domain/ResponseMessage'

const MANAGE_USERS_URL =
  process.env.VUE_APP_MANAGE_USERS_API_URL || 'http://localhost:3000'

const getUsers = async (): Promise<{ users: User[] } & ResponseMessage> => {
  return await axios
    .get(`${MANAGE_USERS_URL}/get/users-info`)
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
): Promise<ResponseMessage> => {
  return await axios
    .put(`${MANAGE_USERS_URL}/change/userInfo`, newUserData)
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response
        ? response.data.error
        : 'Ошибка обновления пользователя'
      return { error }
    })
}

const ManageUsersService = {
  getUsers,
  updateUserInfo,
}

export default ManageUsersService
