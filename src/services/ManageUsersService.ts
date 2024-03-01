import axios from 'axios'
import { User } from '@Domain/User'
import { UpdateUserPassword } from '@Domain/ManageUsers'
import { NewEmailForm } from '@Domain/Invitation'
import Success from '@Domain/ResponseMessage'
import { usersEmailsMocks, usersMocks } from '@Utils/getMocks'
import defineAxios from '@Utils/defineAxios'

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
  const response = await axios.put('/profile/change/password', newPasswordData)
  return response.data
}

const updateUserEmail = async (
  newEmailData: NewEmailForm,
): Promise<Success | Error> => {
  const response = await axios.put('/profile/change/email', newEmailData, {})
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
