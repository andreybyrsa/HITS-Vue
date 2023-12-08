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
    roles: [
      'INITIATOR',
      'TEAM_OWNER',
      'MEMBER',
      'PROJECT_OFFICE',
      'EXPERT',
      'ADMIN',
    ],
    translatedRoles: {
      INITIATOR: 'Инициатор',
      TEAM_OWNER: 'Владелец команды',
      MEMBER: 'Студент',
      PROJECT_OFFICE: 'Проектный офис',
      EXPERT: 'Эксперт',
      ADMIN: 'Админ',
    },
    translatedGroups: {
      INITIATOR: 'Инициаторы',
      TEAM_OWNER: 'Владелец команды',
      MEMBER: 'Студенты',
      PROJECT_OFFICE: 'Проектный офис',
      EXPERT: 'Эксперты',
      ADMIN: 'Админы',
    },
  }
}

export default getRoles
