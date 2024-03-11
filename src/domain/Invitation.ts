import { RolesTypes } from '@Domain'

export interface InviteUserForm {
  email: string
}

export interface InviteUsersForm {
  emails: string[]
  roles: RolesTypes[]
}

export interface InvitationInfo {
  email: string
  roles: RolesTypes[]
}

export interface RecoveryData {
  email: string
}

export interface NewEmailForm {
  key: string
  oldEmail: string
  newEmail: string
  code: number
  url?: string | string[]
}
