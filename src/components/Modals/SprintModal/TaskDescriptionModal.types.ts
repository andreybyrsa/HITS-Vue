import { Task } from '@Domain/Project'

interface TaskDescriptionModalProps {
  isOpened: boolean
  task: Task
}

interface TaskDescriptionModalEmits {
  (event: 'close-modal'): void
}

export { TaskDescriptionModalProps, TaskDescriptionModalEmits }
