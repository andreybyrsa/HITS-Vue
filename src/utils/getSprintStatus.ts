import { SprintStatus } from '@Domain/Project'

interface GetSprintStatusType {
  status: SprintStatus[]
  translatedStatus: {
    [key in SprintStatus]: string
  }
}

function getSprintStatus(): GetSprintStatusType {
  return {
    status: ['ACTIVE', 'DONE'],
    translatedStatus: {
      ACTIVE: 'Активен',
      DONE: 'Завершен',
    },
  }
}

function getSprintStatusStyle(status: SprintStatus) {
  const initialClass = ['px-2', 'py-1', 'rounded-4']

  if (status === 'ACTIVE') {
    initialClass.push('bg-success-subtle', 'text-success')
    return initialClass
  }

  if (status === 'DONE') {
    initialClass.push('bg-warning-subtle', 'text-warning')
    return initialClass
  }
}

export { getSprintStatus, getSprintStatusStyle }
