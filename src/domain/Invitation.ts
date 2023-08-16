import RolesTypes from './Roles'

interface InviteUserForm {
  email: string
}

interface InviteUsersForm {
  emails: string[]
  roles: RolesTypes[]
}

interface InvitationInfo {
  email: string
  roles: RolesTypes[]
}

interface RecoveryData {
  email: string
}

export { InviteUserForm, InviteUsersForm, InvitationInfo, RecoveryData }
