import RolesTypes from '@Domain/Roles'

function getRoles(): RolesTypes[] {
  return ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN']
}

export default getRoles
