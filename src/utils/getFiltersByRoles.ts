import RolesTypes from '@Domain/Roles'
import { IdeaStatusType } from '@Domain/Idea'

interface GetFiltersByRolesType {
  filter: {
    [key in RolesTypes]: IdeaStatusType[]
  }
  filterByExpert: {
    [key in RolesTypes]: boolean
  }
}

function GetFiltersByRoles(): GetFiltersByRolesType {
  return {
    filter: {
      INITIATOR: [],
      MEMBER: ['CONFIRMED', 'ON_MARKET'],
      PROJECT_OFFICE: ['ON_APPROVAL', 'CONFIRMED'],
      EXPERT: [],
      ADMIN: [],
      TEAM_OWNER: [],
      TEACHER: [],
    },
    filterByExpert: {
      INITIATOR: false,
      MEMBER: false,
      PROJECT_OFFICE: false,
      EXPERT: true,
      ADMIN: false,
      TEAM_OWNER: false,
      TEACHER: false,
    },
  }
}

export default GetFiltersByRoles
