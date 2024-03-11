import { IdeaStatusType } from '@Domain'

interface GetIdeaStatusType {
  status: IdeaStatusType[]
  translatedStatus: {
    [key in IdeaStatusType]: string
  }
}

export function getIdeaStatus(): GetIdeaStatusType {
  return {
    status: [
      'NEW',
      'ON_EDITING',
      'ON_APPROVAL',
      'ON_CONFIRMATION',
      'CONFIRMED',
      'ON_MARKET',
    ],
    translatedStatus: {
      NEW: 'Новая',
      ON_EDITING: 'На редактировании',
      ON_APPROVAL: 'На согласовании',
      ON_CONFIRMATION: 'На утверждении',
      CONFIRMED: 'Утверждена',
      ON_MARKET: 'Опубликована',
    },
  }
}

export function getIdeaStatusStyle(status: IdeaStatusType) {
  const initialClass = ['px-2', 'py-1', 'rounded-4']

  if (status === 'NEW') {
    initialClass.push('bg-primary-subtle', 'text-primary')
    return initialClass
  }

  if (status === 'ON_EDITING' || status === 'ON_APPROVAL') {
    initialClass.push('bg-warning-subtle', 'text-warning')
    return initialClass
  }

  if (status === 'ON_CONFIRMATION') {
    initialClass.push('bg-danger-subtle', 'text-danger')
    return initialClass
  }

  if (status === 'CONFIRMED' || status === 'ON_MARKET') {
    initialClass.push('bg-success-subtle', 'text-success')
    return initialClass
  }
}
