import { JoinStatus } from '@Domain/Team'

interface GetInvitationsToTeamType {
  requests: JoinStatus[]
  translatedRequests: {
    [key in JoinStatus]: string
  }
}

function getJoinStatus(): GetInvitationsToTeamType {
  return {
    requests: ['NEW', 'WITHDRAWN', 'ACCEPTED', 'ANNULLED', 'CANCELED'],
    translatedRequests: {
      NEW: 'Новая',
      WITHDRAWN: 'Отозвана',
      ACCEPTED: 'Принята',
      ANNULLED: 'Аннулирована',
      CANCELED: 'Отклонена',
    },
  }
}
function getJoinStatusStyle(status: JoinStatus) {
  const initialClass = ['px-2', 'py-1', 'rounded-4']

  if (status === 'NEW' || status === 'ANNULLED') {
    initialClass.push('bg-primary-subtle', 'text-primary')
    return initialClass
  }

  if (status === 'ACCEPTED') {
    initialClass.push('bg-success-subtle', 'text-success')
    return initialClass
  }

  if (status === 'WITHDRAWN') {
    initialClass.push('bg-warning-subtle', 'text-warning')
    return initialClass
  }

  if (status === 'CANCELED') {
    initialClass.push('bg-danger-subtle', 'text-danger')
    return initialClass
  }
}

export { getJoinStatus, getJoinStatusStyle }
