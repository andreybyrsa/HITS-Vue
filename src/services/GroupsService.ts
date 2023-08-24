import axios from 'axios'

import { UserGroupData } from '@Domain/ManageUsers'
import Success from '@Domain/ResponseMessage'
import UserGroup from '@Domain/Group'

const MANAGE_GROUPS_URL =
  process.env.VUE_APP_MANAGE_GROUPS_API_URL || 'http://localhost:3000'

const createUsersGroup = async (
  usersData: UserGroupData,
  token: string,
): Promise<Success | Error> => {
  return await axios
    .post(`${MANAGE_GROUPS_URL}/add`, usersData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error =
        response?.data?.error ?? 'Ошибка создания группы пользователей'
      return new Error(error)
    })
}

const getUsersGroups = async (token: string): Promise<UserGroup[] | Error> => {
  return await axios
    .get(`${MANAGE_GROUPS_URL}/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка групп пользователей'
      return new Error(error)
    })
}

const GroupService = {
  createUsersGroup,
  getUsersGroups,
}

export default GroupService
