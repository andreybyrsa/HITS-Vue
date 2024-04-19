import { Sprint, Task } from '@Domain/Project'

interface CreateNewTaskProps {
  isOpened: boolean
  task?: Task
  sprint?: Sprint
}

interface CreateTaskModalEmits {
  (event: 'close-modal'): void
}

export { CreateNewTaskProps, CreateTaskModalEmits }
