import StatusTypes from '@Domain/IdeaStatus'

interface GetStatusType {
  status: StatusTypes[]
  translatedStatus: {
    [key in StatusTypes]: string
  }
}

function getStatus(): GetStatusType {
  return {
    status: ['NEW', 'ON_EDITING', 'ON_APPROVAL', 'ON_CONFIRMATION', 'CONFIRMED'],
    translatedStatus: {
      NEW: 'Новая',
      ON_EDITING: 'На редактировании',
      ON_APPROVAL: 'На согласовании',
      ON_CONFIRMATION: 'На утверждении',
      CONFIRMED: 'Утверждена',
    },
  }
}

export default getStatus
