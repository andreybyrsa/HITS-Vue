import Success from '@Domain/ResponseMessage'
import UserGroup from '@Domain/UsersGroup'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'
import getAbortedSignal from '@Utils/getAbortedSignal'
import handleAxiosError from '@Utils/handleAxiosError'

const usersGroupsAxios = defineAxios(getMocks().usersGroups)

const getUsersGroups = async (token: string): Promise<UserGroup[] | Error> => {
  return usersGroupsAxios
    .get('/group/all', {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) =>
      handleAxiosError(error, 'Ошибка получения групп пользователей'),
    )
}

const getUsersGroup = async (
  id: string,
  token: string,
): Promise<UserGroup | Error> => {
  return usersGroupsAxios
    .get(
      `/group/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch((error) =>
      handleAxiosError(error, 'Ошибка получения группы пользователей'),
    )
}

const createUsersGroup = async (
  usersData: UserGroup,
  token: string,
): Promise<UserGroup | Error> => {
  return usersGroupsAxios
    .post('/group/create', usersData, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) =>
      handleAxiosError(error, 'Ошибка создания группы пользователей'),
    )
}

const updateUsersGroup = async (
  usersGroup: UserGroup,
  token: string,
  id: string,
): Promise<UserGroup | Error> => {
  return usersGroupsAxios
    .put(
      `/group/update/${id}`,
      usersGroup,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch((error) =>
      handleAxiosError(error, 'Ошибка редактирования группы пользователей'),
    )
}

const deleteUsersGroup = async (
  id: string,
  token: string,
): Promise<Success | Error> => {
  return usersGroupsAxios
    .delete(
      `/group/delete/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch((error) =>
      handleAxiosError(error, 'Ошибка удаления группы пользователей'),
    )
}

const UsersGroupsService = {
  getUsersGroups,
  getUsersGroup,

  createUsersGroup,

  updateUsersGroup,

  deleteUsersGroup,
}

export default UsersGroupsService
