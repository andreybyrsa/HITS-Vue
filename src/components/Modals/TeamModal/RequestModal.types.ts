import { TeamRequest } from '@Domain/TeamRequest'
import { User } from '@Domain/User'

interface RequestModalEmits {
  (event: 'close-modal'): void
  (event: 'request', request: TeamRequest): void
  (event: 'response', request: TeamRequest): void
}

interface RequestModalProps {
  isOpened: boolean
  type?: 'enter' | 'leave'
  sender?: User
  request?: TeamRequest
  mode: 'write' | 'read'
}

export { RequestModalEmits, RequestModalProps }
