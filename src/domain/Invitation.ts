import RolesTypes from './Roles'

interface InviteUserForm {
  email: string
  roles: RolesTypes[]
}

interface InviteUsersForm {
  email: string[]
  roles: RolesTypes[]
}

interface InvitationInfo {
  email: string
  roles: RolesTypes[]
}

interface RecoveryData {
  email: string
}

interface NewEmailForm {
  key: string
  oldEmail: string
  newEmail: string
  code: number
  url?: string | string[]
}

export {
  InviteUserForm,
  InviteUsersForm,
  InvitationInfo,
  RecoveryData,
  NewEmailForm,
}
