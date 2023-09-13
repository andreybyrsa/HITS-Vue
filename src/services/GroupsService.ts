import axios from 'axios'

import Success from '@Domain/ResponseMessage'
import { UserGroup } from '@Domain/Group'

const MANAGE_GROUPS_URL =
  process.env.VUE_APP_MANAGE_GROUPS_API_URL || 'http://localhost:3000'

const createUsersGroup = async (
  usersData: UserGroup,
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
      const error = response?.data?.error ?? 'Ошибка создания группы пользователей'
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

const editUsersGroup = async (
  usersData: UserGroup,
  token: string,
): Promise<Success | Error> => {
  return await axios
    .post(`${MANAGE_GROUPS_URL}/update`, usersData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error =
        response?.data?.error ?? 'Ошибка редактирования группы пользователей'
      return new Error(error)
    })
}

const GroupService = {
  createUsersGroup,
  getUsersGroups,
  editUsersGroup,
}

export default GroupService
