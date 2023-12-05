import RolesTypes from '@Domain/Roles'

interface GetRolesType {
  roles: RolesTypes[]
  translatedRoles: {
    [key in RolesTypes]: string
  }
  translatedGroups: {
    [key in RolesTypes]: string
  }
}

function getRoles(): GetRolesType {
  return {
    roles: ['INITIATOR', 'LEADER', 'MEMBER', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
    translatedRoles: {
      INITIATOR: 'Инициатор',
      LEADER: 'Тим-лидер',
      MEMBER: 'Студент',
      PROJECT_OFFICE: 'Проектный офис',
      EXPERT: 'Эксперт',
      ADMIN: 'Админ',
    },
    translatedGroups: {
      INITIATOR: 'Инициаторы',
      LEADER: 'Тим-лидеры',
      MEMBER: 'Студенты',
      PROJECT_OFFICE: 'Проектный офис',
      EXPERT: 'Эксперты',
      ADMIN: 'Админы',
    },
  }
}

export default getRoles
