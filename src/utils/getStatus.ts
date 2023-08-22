import StatusTypes from '@Domain/IdeaStatus'

interface GetRolesType {
  status: StatusTypes[]
  translatedStatus: {
    [key in StatusTypes]: string
  }
}

function getStatus(): GetRolesType {
  return {
    status: ['NEW', 'ON_EDITING', 'ON_APPROVAL', 'ON_CONFIRMATION', 'CONFIRMED'],
    translatedStatus: {
      NEW: 'Новая',
      ON_EDITING: 'На редактировании',
      ON_APPROVAL: 'На согласовании',
      ON_CONFIRMATION: 'На утверждении',
      CONFIRMED: 'Утверждено',
    },
  }
}

export default getStatus
