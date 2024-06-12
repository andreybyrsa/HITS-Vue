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
import { usersMocks } from '@Utils/getMocks'

const usersAxios = defineAxios(usersMocks)

const getUsers = async (token: string): Promise<User[] | Error> => {
  return usersAxios
    .get('/authorization-service/profile/users/all', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки пользователей'))
}

const updateUserInfo = async (
  newUserData: User,
  token: string,
): Promise<User | Error> => {
  return usersAxios
    .put(
      `/authorization-service/profile/user/${newUserData.id}`,
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

const updateUserEmail = async (
  newEmailData: NewEmailForm,
  token: string,
): Promise<Success | Error> => {
  return axios
    .put(
      `${API_URL}/authorization-service/account/change/email/${newEmailData.code}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка обновления почты'))
}

const deleteUser = async (
  userId: string,
  token: string,
): Promise<Success | Error> => {
  return usersAxios
    .delete(
      `/authorization-service/profile/user/{userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
      { params: { id: userId } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка обновления почты'))
}

const ManageUsersService = {
  getUsers,

  updateUserInfo,
  updateUserEmail,

  deleteUser,
}

export default ManageUsersService
