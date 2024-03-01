import Success from '@Domain/ResponseMessage'
import UserGroup from '@Domain/UsersGroup'
import { usersGroupsMocks } from '@Utils/getMocks'
import defineAxios from '@Utils/defineAxios'

const defineApi = defineAxios(usersGroupsMocks)

const getUsersGroups = async (): Promise<UserGroup[] | Error> => {
  const response = await defineApi.get('/group/all')
  return response.data
}

const getUsersGroup = async (id: string): Promise<UserGroup | Error> => {
  const response = await defineApi.get(`/group/${id}`, {}, { params: { id } })
  return response.data
}

const createUsersGroup = async (
  usersData: UserGroup,
): Promise<UserGroup | Error> => {
  const response = await defineApi.post('/group/create', usersData)
  return response.data
}

const updateUsersGroup = async (
  usersGroup: UserGroup,

  id: string,
): Promise<UserGroup | Error> => {
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
