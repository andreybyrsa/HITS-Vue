import { ProjectStatus } from '@Domain/Project'

interface GetProjectStatusType {
  status: ProjectStatus[]
  translatedStatus: {
    [key in ProjectStatus]: string
  }
}

function getProjectStatus(): GetProjectStatusType {
  return {
    status: ['ACTIVE', 'DONE'],
    translatedStatus: {
      ACTIVE: 'Активен',
      DONE: 'Завершен',
    },
  }
}

function getProjectStatusStyle(status: ProjectStatus) {
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

export { getProjectStatus, getProjectStatusStyle }
