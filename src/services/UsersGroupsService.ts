import Success from '@Domain/ResponseMessage'
import UserGroup from '@Domain/UsersGroup'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'

const usersGroupsAxios = defineAxios(getMocks().usersGroups)

const getUsersGroups = async (token: string): Promise<UserGroup[] | Error> => {
  return await usersGroupsAxios
    .get('/group/all', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения групп пользователей'
      return new Error(error)
    })
}

const getUsersGroup = async (
  id: number,
  token: string,
): Promise<UserGroup | Error> => {
  return await usersGroupsAxios
    .get(
      `/group/${id}`,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения группы пользователей'
      return new Error(error)
    })
}

const createUsersGroup = async (
  usersData: UserGroup,
  token: string,
): Promise<UserGroup | Error> => {
  return await usersGroupsAxios
    .post('/group/create', usersData, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка создания группы пользователей'
      return new Error(error)
    })
}

const updateUsersGroup = async (
  usersGroup: UserGroup,
  token: string,
  id: number,
): Promise<UserGroup | Error> => {
  return await usersGroupsAxios
    .put(
      `/group/update/${id}`,
      usersGroup,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error =
        response?.data?.error ?? 'Ошибка редактирования группы пользователей'
      return new Error(error)
    })
}

const deleteUsersGroup = async (
  id: number,
  token: string,
): Promise<Success | Error> => {
  return await usersGroupsAxios
    .delete(
      `/group/delete/${id}`,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка удаления группы пользователей'
      return new Error(error)
    })
}

const UsersGroupsService = {
  getUsersGroups,
  getUsersGroup,
  createUsersGroup,
  updateUsersGroup,
  deleteUsersGroup,
}

export default UsersGroupsService
