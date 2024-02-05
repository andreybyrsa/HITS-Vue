import { ProjectMemberRole } from '@Domain/Project'

interface GetRoleProjectMemberType {
  role: ProjectMemberRole[]
  translatedRoles: {
    [key in ProjectMemberRole]: string
  }
}

function getRoleProjectMember(): GetRoleProjectMemberType {
  return {
    role: ['INITIATOR', 'TEAM_LEADER', 'MEMBER'],
    translatedRoles: {
      INITIATOR: 'Инициатор',
      TEAM_LEADER: 'Тим-лидер',
      MEMBER: 'Участник',
    },
  }
}

function getRoleProjectMemberStyle(role: ProjectMemberRole) {
  const initialClass = ['px-2', 'py-1', 'rounded-4']

  if (role === 'INITIATOR') {
    initialClass.push('bg-success-subtle', 'text-success')
    return initialClass
  }

  if (role === 'TEAM_LEADER') {
    initialClass.push('bg-warning-subtle', 'text-warning')
    return initialClass
  }

  if (role === 'MEMBER') {
    initialClass.push('bg-primary-subtle', 'text-primary')
    return initialClass
  }
}

export { getRoleProjectMember, getRoleProjectMemberStyle }
