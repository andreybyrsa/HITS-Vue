import { User } from '@Domain/User'

interface InviteModalProps {
  isOpened: boolean
}

interface InviteModalEmits {
  (event: 'close-modal'): void
  (event: 'invite', user: User): void
}

export { InviteModalProps, InviteModalEmits }
