import { User } from '@Domain/User'

interface InviteModalProps {
  isOpened: boolean
}

interface InviteModalEmits {
  (event: 'close-modal'): void
  (event: 'inviteFromPortal', user: User[]): void
  (event: 'inviteFromOutside', emails: string[]): void
}

interface InviteFromOutsideForm {
  emails: string[]
}

export { InviteModalProps, InviteModalEmits, InviteFromOutsideForm }
