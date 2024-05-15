import { Task } from '@Domain/Project'
import { User } from '@Domain/User'

interface TaskDescriptionModalProps {
  isOpened: boolean
  task: Task
  user: User
}

interface TaskDescriptionModalEmits {
  (event: 'close-modal'): void
  (event: 'update-leader-comment', input: string): void
  (event: 'update-executor-comment', input: string): void
  (event: 'update-description', input: string): void
  (event: 'update-name', input: string): void
}

export { TaskDescriptionModalProps, TaskDescriptionModalEmits }
