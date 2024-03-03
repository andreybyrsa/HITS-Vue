import { Success, UsersGroup } from '@Domain'
import { defineAxios, usersGroupsMocks } from '@Utils'

const defineApi = defineAxios(usersGroupsMocks)

const getUsersGroups = async (): Promise<UsersGroup[] | Error> => {
  const response = await defineApi.get('/group/all')
  return response.data
}

const getUsersGroup = async (id: string): Promise<UsersGroup | Error> => {
  const response = await defineApi.get(`/group/${id}`, {}, { params: { id } })
  return response.data
}

const createUsersGroup = async (
  usersData: UsersGroup,
): Promise<UsersGroup | Error> => {
  const response = await defineApi.post('/group/create', usersData)
  return response.data
}

const updateUsersGroup = async (
  usersGroup: UsersGroup,

  id: string,
): Promise<UsersGroup | Error> => {
  const response = await defineApi.put(
    `/group/update/${id}`,
    usersGroup,
    {},
    { params: { id } },
  )
  return response.data
}

const deleteUsersGroup = async (id: string): Promise<Success | Error> => {
  const response = await defineApi.delete(
    `/group/delete/${id}`,
    {},
    { params: { id } },
  )
  return response.data
}

export const UsersGroupsService = {
  getUsersGroups,
  getUsersGroup,
  createUsersGroup,
  updateUsersGroup,
  deleteUsersGroup,
}
