import { Task } from '@Domain/Project'

interface CreateNewTaskProps {
  isOpened: boolean
  task?: Task
}

interface CreateTaskModalEmits {
  (event: 'close-modal'): void
}

export { CreateNewTaskProps, CreateTaskModalEmits }
