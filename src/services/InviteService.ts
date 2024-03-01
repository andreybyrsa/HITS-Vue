import { api } from '@Api'
import {
  InviteUserForm,
  InviteUsersForm,
  InvitationInfo,
  RecoveryData,
  NewEmailForm,
} from '@Domain/Invitation'
import Success from '@Domain/ResponseMessage'

const getInvitationInfo = async (
  slug: string | string[],
): Promise<InvitationInfo | Error> => {
  const response = await api.get(`/profile/get/invitation/${slug}`)
  return response.data
}

const getInfoToChangeEmail = async (
  slug: string | string[],
): Promise<NewEmailForm | Error> => {
  const response = await api.get(`/profile/change/email/${slug}`)
  return response.data
}

const inviteUserByEmail = async (data: InviteUserForm): Promise<Success | Error> => {
  const response = await api.post('/profile/send/email', data)
  return response.data
}

const inviteUsers = async (data: InviteUsersForm): Promise<Success | Error> => {
  const response = await api.post('/profile/send/emails', data)
  return response.data
}

const sendRecoveryEmail = async (data: RecoveryData): Promise<string | Error> => {
  const response = await api.post('/profile/send/change/password', data)
  return response.data
}

const sendUrlToChangeEmail = async (
  userData: NewEmailForm,
): Promise<Success | Error> => {
  const response = await api.post('/profile/send/change/email', userData, {})
  return response.data
}

const deleteInvitationInfo = async (slug: string | string[]) => {
  const response = await api.delete(`/profile/delete/invitation/${slug}`)
  return response.data
}

export const InviteService = {
  getInvitationInfo,
  getInfoToChangeEmail,
  inviteUserByEmail,
  inviteUsers,
  sendRecoveryEmail,
  sendUrlToChangeEmail,
  deleteInvitationInfo,
}
