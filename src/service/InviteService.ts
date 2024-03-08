import { api } from '@Api'
import {
  Success,
  InviteUserForm,
  InviteUsersForm,
  InvitationInfo,
  RecoveryData,
  NewEmailForm,
} from '@Domain'
import { TryCatch } from '@Utils'

export class InviteService {
  @TryCatch
  static async getInvitationInfo(
    slug: string | string[],
  ): Promise<InvitationInfo | Error> {
    const response = await api.get(`/profile/get/invitation/${slug}`)
    return response.data
  }

  @TryCatch
  static async getInfoToChangeEmail(
    slug: string | string[],
  ): Promise<NewEmailForm | Error> {
    const response = await api.get(`/profile/change/email/${slug}`)
    return response.data
  }

  @TryCatch
  static async inviteUserByEmail(data: InviteUserForm): Promise<Success | Error> {
    const response = await api.post('/profile/send/email', data)
    return response.data
  }

  @TryCatch
  static async inviteUsers(data: InviteUsersForm): Promise<Success | Error> {
    const response = await api.post('/profile/send/emails', data)
    return response.data
  }

  @TryCatch
  static async sendRecoveryEmail(data: RecoveryData): Promise<string | Error> {
    const response = await api.post('/profile/send/change/password', data)
    return response.data
  }

  @TryCatch
  static async sendUrlToChangeEmail(
    userData: NewEmailForm,
  ): Promise<Success | Error> {
    const response = await api.post('/profile/send/change/email', userData, {})
    return response.data
  }

  @TryCatch
  static async deleteInvitationInfo(slug: string | string[]) {
    const response = await api.delete(`/profile/delete/invitation/${slug}`)
    return response.data
  }
}
