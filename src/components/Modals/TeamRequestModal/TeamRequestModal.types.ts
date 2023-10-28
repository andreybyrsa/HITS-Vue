import { TeamRequest } from '@Domain/TeamRequest'

interface TeamRequestModalEmits {
  (event: 'close-modal'): void
  (event: 'request', request: TeamRequest): void
  (event: 'response', request: TeamRequest): void
}

interface TeamRequestModalProps {
  isOpened: boolean
  type?: 'enter' | 'leave'
  request?: TeamRequest
  mode: 'write' | 'read'
}

export { TeamRequestModalEmits, TeamRequestModalProps }
