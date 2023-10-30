import { TeamRequest } from '@Domain/TeamRequest'

interface TeamRequestModalEmits {
  (event: 'close-modal'): void
  (event: 'sendRequest', request: TeamRequest): void
  (event: 'reject', requestId: number): void
  (event: 'accept', requestId: number): void
}

interface TeamRequestModalProps {
  isOpened: boolean
  type?: 'enter' | 'leave'
  request?: TeamRequest
  mode: 'write' | 'read'
}

export { TeamRequestModalEmits, TeamRequestModalProps }
