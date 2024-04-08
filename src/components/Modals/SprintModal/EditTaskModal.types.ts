import { Task } from '@Domain/Project'

interface EditTaskProps {
  isOpened: boolean
  task?: Task
}

interface EditTaskModalEmits {
  (event: 'close-modal'): void
}

export { EditTaskProps, EditTaskModalEmits }