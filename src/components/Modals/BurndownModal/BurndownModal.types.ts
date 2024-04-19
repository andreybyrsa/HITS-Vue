import { Sprint } from '@Domain/Project'

interface BurndownModalProps {
  isOpened: boolean
  sprint: Sprint
}

interface BurndownModalEmits {
  (event: 'close-modal'): void
}

export { BurndownModalProps, BurndownModalEmits }
