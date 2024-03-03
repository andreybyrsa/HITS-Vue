import { api } from '@Api'
import { User, UpdateUserPassword, NewEmailForm, Success } from '@Domain'
import { defineAxios, usersEmailsMocks, usersMocks } from '@Utils'

const usersDefineApi = defineAxios(usersMocks)
const usersEmailsDefineApi = defineAxios(usersEmailsMocks)

const getUsers = async (): Promise<User[] | Error> => {
  const response = await usersDefineApi.get('/profile/get/users')
  return response.data
}

const getUsersEmails = async (): Promise<string[] | Error> => {
  const response = await usersEmailsDefineApi.get('/profile/get/emails')
  return response.data
}

const updateUserInfo = async (newUserData: User): Promise<User | Error> => {
  const response = await usersDefineApi.put(
    '/profile/change/info',
    newUserData,
    {},
    { params: { id: newUserData.id } },
  )
  return response.data
}

const updateUserPassword = async (
  newPasswordData: UpdateUserPassword,
): Promise<Success | Error> => {
  const response = await api.put('/profile/change/password', newPasswordData)
  return response.data
}

const updateUserEmail = async (
  newEmailData: NewEmailForm,
): Promise<Success | Error> => {
  const response = await api.put('/profile/change/email', newEmailData, {})
  return response.data
}

const deleteUser = async (id: string): Promise<Success | Error> => {
  const response = await usersDefineApi.delete(
    `/profile/delete/user/${id}`,
    {},
    { params: { id } },
  )
  return response.data
}

export const ManageUsersService = {
  getUsers,
  getUsersEmails,
  updateUserInfo,
  updateUserPassword,
  updateUserEmail,
  deleteUser,
}
