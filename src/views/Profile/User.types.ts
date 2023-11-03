import RolesTypes from '@Domain/Roles'

interface ProfileUserProps {
  roles: RolesTypes[]
  lastActivity: Date
  role: RolesTypes | undefined
}

export default ProfileUserProps
