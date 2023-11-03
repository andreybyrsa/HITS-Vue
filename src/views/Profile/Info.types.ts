import RolesTypes from '@Domain/Roles'

interface ProfileInfoProps {
  lastName: string
  firstName: string
  email: string
  role: RolesTypes | undefined
  roles: RolesTypes[]
}

export default ProfileInfoProps
