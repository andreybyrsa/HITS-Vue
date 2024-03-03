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
}

export { TaskDescriptionModalProps, TaskDescriptionModalEmits }
