import axios from 'axios'

import Success from '@Domain/ResponseMessage'
import UserGroup from '@Domain/Group'

const MANAGE_GROUPS_URL =
  process.env.VUE_APP_MANAGE_GROUPS_API_URL || 'http://localhost:3000'

const createUsersGroup = async (
  usersData: UserGroup,
  token: string,
): Promise<UserGroup | Error> => {
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
      console.log(MANAGE_GROUPS_URL)
      return new Error(error)
    })
}

const editUsersGroup = async (
  usersData: UserGroup,
  token: string,
  id: string,
): Promise<Success | Error> => {
  return await axios
    .put(`${MANAGE_GROUPS_URL}/update/${id}`, usersData, {
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

const deleteUsersGroup = async (
  id: string,
  token: string,
): Promise<Success | Error> => {
  return await axios
    .delete(`${MANAGE_GROUPS_URL}/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка удаления группы пользователей'
      return new Error(error)
    })
}

const GroupService = {
  createUsersGroup,
  getUsersGroups,
  editUsersGroup,
  deleteUsersGroup,
}

export default GroupService
