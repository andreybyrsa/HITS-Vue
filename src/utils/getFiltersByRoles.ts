import RolesTypes from '@Domain/Roles'
import IdeaStatusTypes from '@Domain/IdeaStatus'

interface GetFiltersByRolesType {
  filter: {
    [key in RolesTypes]: IdeaStatusTypes[]
  }
  filterByExpert: {
    [key in RolesTypes]: boolean
  }
}

function GetFiltersByRoles(): GetFiltersByRolesType {
  return {
    filter: {
      INITIATOR: [],
      MEMBER: [],
      PROJECT_OFFICE: ['ON_APPROVAL'],
      EXPERT: [],
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
