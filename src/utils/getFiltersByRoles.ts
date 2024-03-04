import { IdeaStatusType, RolesTypes } from '@Domain'

interface GetFiltersByRolesType {
  filter: {
    [key in RolesTypes]: IdeaStatusType[]
  }
  filterByExpert: {
    [key in RolesTypes]: boolean
  }
}

export function getFiltersByRoles(): GetFiltersByRolesType {
  return {
    filter: {
      INITIATOR: [],
      MEMBER: ['CONFIRMED', 'ON_MARKET'],
      PROJECT_OFFICE: ['ON_APPROVAL', 'CONFIRMED'],
      EXPERT: [],
      ADMIN: [],
      TEAM_OWNER: [],
    },
    filterByExpert: {
      INITIATOR: false,
      MEMBER: false,
      PROJECT_OFFICE: false,
      EXPERT: true,
      ADMIN: false,
      TEAM_OWNER: false,
    },
  }
}
