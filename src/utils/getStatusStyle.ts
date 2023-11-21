import IdeaStatusTypes from '@Domain/IdeaStatus'

function getStatusStyle(status: IdeaStatusTypes) {
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

  if (status === 'CONFIRMED') {
    initialClass.push('bg-success-subtle', 'text-success')
    return initialClass
  }
}

export default getStatusStyle
