import axios from 'axios'

import { User } from '@Domain/User'
import { InvitationInfo, InvitationForm } from '@Domain/Invitation'
import ResponseMessage from '@Domain/ResponseMessage'

const INVITE_URL = process.env.VUE_APP_INVITATION_URL || 'http://localhost:3000'
const USERS_URL = process.env.VUE_APP_USERS_API_URL || 'http://localhost:3000'

const getUsers = async (): Promise<User[]> => {
  return await axios
    .get(USERS_URL)
    .then((response) => response.data)
    .catch(() => [
      {
        token: 'dsamp23',
        email: 'admin@mail.com',
        firstName: 'Andrey',
        lastName: 'Byrsa',
        roles: ['ADMIN', 'INITIATOR'],
      },
      {
        token: 'dsam1m23',
        email: 'admin@mail.com',
        firstName: 'Andrey1',
        lastName: 'Byrsa2',
        roles: ['ADMIN', 'INITIATOR'],
      },
    ])
}

const saveEditedUser = async (user: User): Promise<ResponseMessage> => {
  return await axios
    .post(`${USERS_URL}/save`, user)
    .then(() => ({ success: 'Успешное сохранение' }))
    .catch(() => ({ error: 'Ошибка редактирования' }))
}

const inviteUserByEmail = async (
  userData: InvitationForm,
): Promise<ResponseMessage> => {
  return await axios
    .post(`${INVITE_URL}/email`, userData)
    .then((response) => response.data)
    .catch((error) => console.warn(`invite ${error}`))
}

const inviteUsersByFile = async (
  userData: InvitationForm,
): Promise<ResponseMessage> => {
  return await axios
    .post(`${INVITE_URL}/emails`, userData)
    .then((response) => response.data)
    .catch((error) => console.warn(error))
}

const getInvitationInfo = async (
  slug: string | string[],
): Promise<InvitationInfo> => {
  return await axios
    .get(`${INVITE_URL}/get-invitation/${slug}`)
    .then((response) => response.data)
    .catch((error) => console.warn(error))
}

const ManageUsersService = {
  getUsers,
  saveEditedUser,
  inviteUserByEmail,
  inviteUsersByFile,
  getInvitationInfo,
}

export default ManageUsersService
