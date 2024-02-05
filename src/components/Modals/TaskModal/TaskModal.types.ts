import { Task } from '@Domain/Project'

interface CreateNewTaskProps {
  isOpened: boolean
  isActiveSprint?: boolean
  task?: Task | null
}

interface CreateTaskModalEmits {
  (event: 'close-modal'): void
}

export { CreateNewTaskProps, CreateTaskModalEmits }
