import RolesTypes from '@Domain/Roles'

interface GetRolesType {
  roles: RolesTypes[]
  translatedRoles: {
    INITIATOR: string
    PROJECT_OFFICE: string
    EXPERT: string
    ADMIN: string
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
  }
}

export default getRoles
