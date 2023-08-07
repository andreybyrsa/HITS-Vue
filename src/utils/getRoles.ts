import RolesTypes from '@Domain/Roles'

interface GetRolesType {
  roles: RolesTypes[]
  translatedRoles: {
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
      ADMIN: 'админ',
    },
  }
}

export default getRoles
