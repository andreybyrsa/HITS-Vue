import axios from 'axios'

import {
  InviteUserForm,
  InviteUsersForm,
  InvitationInfo,
  RecoveryData,
} from '@Domain/Invitation'
import ResponseMessage from '@Domain/ResponseMessage'

const INVITATION_URL =
  process.env.VUE_APP_INVITATION_URL || 'http://localhost:3000'

const inviteUserByEmail = async (
  userData: InviteUserForm,
): Promise<ResponseMessage> => {
  return await axios
    .post(`${INVITATION_URL}/send/email`, userData)
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response
        ? response.data.error
        : 'Ошибка приглашения пользователя'
      return { error }
    })
}

const inviteUsers = async (
  usersData: InviteUsersForm,
): Promise<ResponseMessage> => {
  return await axios
    .post(`${INVITATION_URL}/send/emails`, usersData)
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response
        ? response.data.error
        : 'Ошибка приглашения пользователей'
      return { error }
    })
}

const sendRecoveryEmail = async (
  recoveryData: RecoveryData,
): Promise<ResponseMessage> => {
  return axios
    .post(`${INVITATION_URL}/send/request-to-change-password`, recoveryData)
    .then((response) => response.data)
    .catch(({ response }) => {
      const { error } = response.data
      return { error }
    })
}

const getInvitationInfo = async (
  slug: string | string[],
): Promise<InvitationInfo & ResponseMessage> => {
  return await axios
    .get(`${INVITATION_URL}/get/invitation/${slug}`)
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response ? response.data.error : 'Ошибка приглашения'
      return { error }
    })
}

const deleteInvitationInfo = async (slug: string | string[]) => {
  return await axios
    .delete(`${INVITATION_URL}/delete/invitation/${slug}`)
    .catch<ResponseMessage>(({ response }) => {
      const error = response
        ? response.data.error
        : 'Ошибка удаления приглашения'
      return { error }
    })
}

const InvitationService = {
  inviteUserByEmail,
  inviteUsers,
  sendRecoveryEmail,
  getInvitationInfo,
  deleteInvitationInfo,
}

export default InvitationService
