import RolesTypes from '@Domain/Roles'
import { RouteLocationRaw } from 'vue-router'

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
      'TEAM_LEADER',
      'MEMBER',
      'PROJECT_OFFICE',
      'EXPERT',
      'ADMIN',
      'TEACHER',
    ],
    translatedRoles: {
      INITIATOR: 'Инициатор',
      TEAM_OWNER: 'Владелец команды',
      TEAM_LEADER: 'Лидер команды',
      MEMBER: 'Студент',
      PROJECT_OFFICE: 'Проектный офис',
      EXPERT: 'Эксперт',
      ADMIN: 'Админ',
      TEACHER: 'Преподаватель',
    },
    translatedGroups: {
      INITIATOR: 'Инициаторы',
      TEAM_OWNER: 'Владелец команды',
      TEAM_LEADER: 'Лидеры команд',
      MEMBER: 'Студенты',
      PROJECT_OFFICE: 'Проектный офис',
      EXPERT: 'Эксперты',
      ADMIN: 'Админы',
      TEACHER: 'Преподаватели',
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
    currentRole === 'MEMBER' ||
    currentRole === 'TEAM_LEADER'
  ) {
    initialClass.push('bg-primary-subtle', 'text-primary')
    return initialClass
  }

  if (
    currentRole === 'PROJECT_OFFICE' ||
    currentRole === 'EXPERT' ||
    currentRole === 'TEACHER'
  ) {
    initialClass.push('bg-success-subtle', 'text-success')
    return initialClass
  }

  if (currentRole === 'ADMIN') {
    initialClass.push('bg-danger-subtle', 'text-danger')
    return initialClass
  }
}

// !котятки, не забываем следить за этой функцией, при добавлении новых ролей, чтобы нормально редиректило, иначе будет критический баг, спасибо))
function getRouteByUserRole(
  currentRole: RolesTypes | RolesTypes[],
): RouteLocationRaw {
  const teamList = ['TEAM_OWNER', 'TEAM_LEADER']

  if (currentRole instanceof Array) {
    const isTeam = teamList.some((role, index) => role === currentRole[index])

    if (isTeam) {
      return { name: 'teams-list' }
    }

    return { name: 'ideas-list' }
  }

  if (teamList.includes(currentRole)) {
    return { name: 'teams-list' }
  }

  return { name: 'ideas-list' }
}

export { getUserRolesInfo, getUserRoleInfoStyle, getRouteByUserRole }
