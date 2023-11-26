import RolesTypes from '@Domain/Roles'

function getRolesStyle(roles: RolesTypes[], index: number) {
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
    currentRole === 'TEAM_LEADER' ||
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

export default getRolesStyle
