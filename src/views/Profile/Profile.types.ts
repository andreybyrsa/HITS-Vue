import { User } from '@Domain/User'

interface ProfileProps {
  isOpened: boolean
  user?: User
}

interface ProfileEmits {
  (event: 'close-modal'): void
}

export { ProfileProps, ProfileEmits }
