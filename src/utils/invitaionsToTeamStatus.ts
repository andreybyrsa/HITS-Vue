import { InvitationToTeamStatus } from '@Domain/Team'

interface GetInvitationsType {
  invitations: InvitationToTeamStatus[]
  translatedInvitations: {
    [key in InvitationToTeamStatus]: string
  }
}

function getInvitationsToTeamStatus(): GetInvitationsType {
  return {
    invitations: ['NEW', 'WITHDRAWN', 'ACCEPTED', 'ANNULLED', 'CANCELED'],
    translatedInvitations: {
      NEW: 'Новая',
      WITHDRAWN: 'Отозвана',
      ACCEPTED: 'Принята',
      ANNULLED: 'Аннулирована',
      CANCELED: 'Отклонена',
    },
  }
}
function getInvitationToTeamStatusStyle(status: InvitationToTeamStatus) {
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

export { getInvitationsToTeamStatus, getInvitationToTeamStatusStyle }
