import { TaskStatus } from '@Domain/Project'

interface GetTaskStatusType {
  status: TaskStatus[]
  translatedStatus: {
    [key in TaskStatus]: string
  }
}

function getTaskStatus(): GetTaskStatusType {
  return {
    status: [
      'InBackLog',
      'OnModification',
      'NewTask',
      'InProgress',
      'OnVerification',
      'Done',
    ],
    translatedStatus: {
      InBackLog: 'В бэклоге',
      OnModification: 'На доработке',
      NewTask: 'Новая',
      InProgress: 'Выполняется',
      OnVerification: 'На проверке',
      Done: 'Выполнена',
    },
  }
}

function getTaskStatusStyle(status: TaskStatus) {
  const initialClass = ['px-2', 'py-1', 'rounded-4']

  if (status === 'InProgress') {
    initialClass.push('bg-success-subtle', 'text-success')
    return initialClass
  }

  if (status === 'Done') {
    initialClass.push('bg-warning-subtle', 'text-warning')
    return initialClass
  }

  if (status === 'OnModification') {
    initialClass.push('bg-success-subtle', 'text-success')
    return initialClass
  }

  if (status === 'OnVerification') {
    initialClass.push('bg-success-subtle', 'text-success')
    return initialClass
  }

  if (status === 'InBackLog') {
    initialClass.push('bg-success-subtle', 'text-success')
    return initialClass
  }

  if (status === 'NewTask') {
    initialClass.push('bg-success-subtle', 'text-success')
    return initialClass
  }
}

export { getTaskStatus, getTaskStatusStyle }
