import RolesTypes from '@Domain/Roles'

interface GetRolesType {
  roles: RolesTypes[]
  translatedRoles: {
    [key in RolesTypes]: string
  }
  colors: {
    [key in RolesTypes]: string
  }
}

function getRoles(): GetRolesType {
  return {
    roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
    translatedRoles: {
      INITIATOR: 'Инициатор',
      PROJECT_OFFICE: 'Проектный офис',
      EXPERT: 'Эксперт',
      ADMIN: 'Админ',
    },
    colors: {
      INITIATOR: 'text-secondary',
      PROJECT_OFFICE: 'text-secondary',
      EXPERT: 'text-secondary',
      ADMIN: 'text-danger',
    },
  }
}

export default getRoles
