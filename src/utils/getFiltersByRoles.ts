import RolesTypes from '@Domain/Roles'
import IdeaStatusTypes from '@Domain/IdeaStatus'

interface GetFiltersByRolesType {
  roles: RolesTypes[]
  filter: {
    [key in RolesTypes]: IdeaStatusTypes[]
  }
  filterByExpert: {
    [key in RolesTypes]: boolean
  }
}

function GetFiltersByRoles(): GetFiltersByRolesType {
  return {
    roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN', 'MEMBER'],
    filter: {
      INITIATOR: [],
      MEMBER: [],
      PROJECT_OFFICE: ['ON_APPROVAL'],
      EXPERT: ['ON_CONFIRMATION'],
      ADMIN: [],
    },
    filterByExpert: {
      INITIATOR: false,
      MEMBER: false,
      PROJECT_OFFICE: false,
      EXPERT: true,
      ADMIN: false,
    },
  }
}

export default GetFiltersByRoles
