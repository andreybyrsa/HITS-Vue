import { Sprint } from '@Domain/Project'

interface FinishSprintModalProps {
  isOpened: boolean
  sprint: Sprint
}

interface FinishSprintModalEmits {
  (event: 'close-modal'): void
}

export { FinishSprintModalProps, FinishSprintModalEmits }
