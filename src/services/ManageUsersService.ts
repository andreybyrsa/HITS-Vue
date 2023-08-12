import axios from 'axios'

import { UpdateUserData, User } from '@Domain/User'
import ResponseMessage from '@Domain/ResponseMessage'

const MANAGE_USERS_URL =
  process.env.VUE_APP_MANAGE_USERS_API_URL || 'http://localhost:3000'

const getUsers = async (): Promise<User[] & ResponseMessage> => {
  return await axios
    .get(`${MANAGE_USERS_URL}/get/users-info`)
    .then((response) => response.data)
    .catch(({ response }) => {
      const { error } = response.data
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
      const { error } = response.data
      return { error }
    })
}

const ManageUsersService = {
  getUsers,
  updateUserInfo,
}

export default ManageUsersService
