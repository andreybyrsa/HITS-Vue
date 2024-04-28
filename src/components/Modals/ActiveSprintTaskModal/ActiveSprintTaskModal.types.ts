import { Task } from '@Domain/Project'

interface TaskStatisticsModalProps {
  isOpened: boolean
  task: Task
}

interface TaskHistoryProps {
  taskId: string
}

interface TaskDataProps {
  task: Task
}

interface TaskStatisticsModalEmits {
  (event: 'close-modal'): void
}

export {
  TaskStatisticsModalProps,
  TaskHistoryProps,
  TaskDataProps,
  TaskStatisticsModalEmits,
}
