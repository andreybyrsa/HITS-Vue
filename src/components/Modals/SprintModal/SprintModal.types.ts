import { Sprint } from '@Domain/Project'

interface SprintModalProps {
  isOpened: boolean
  sprint: Sprint
}

interface SprintModalEmits {
  (event: 'close-modal'): void
}

export { SprintModalProps, SprintModalEmits }
