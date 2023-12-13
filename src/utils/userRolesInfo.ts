import RolesTypes from '@Domain/Roles'

interface GetUserRolesType {
  roles: RolesTypes[]
  translatedRoles: {
    [key in RolesTypes]: string
  }
  translatedGroups: {
    [key in RolesTypes]: string
  }
}

function getUserRolesInfo(): GetUserRolesType {
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

function getUserRoleInfoStyle(roles: RolesTypes[], index: number) {
  const currentRole = roles[index]
  const initialClass = [
    'px-2',
    'py-1',
    'rounded-4',
    'text-center',
    'align-self-start',
  ]

  if (
    currentRole === 'INITIATOR' ||
    currentRole === 'TEAM_OWNER' ||
    currentRole === 'MEMBER'
  ) {
    initialClass.push('bg-primary-subtle', 'text-primary')
    return initialClass
  }

  if (currentRole === 'PROJECT_OFFICE' || currentRole === 'EXPERT') {
    initialClass.push('bg-success-subtle', 'text-success')
    return initialClass
  }

  if (currentRole === 'ADMIN') {
    initialClass.push('bg-danger-subtle', 'text-danger')
    return initialClass
  }
}

export { getUserRolesInfo, getUserRoleInfoStyle }
