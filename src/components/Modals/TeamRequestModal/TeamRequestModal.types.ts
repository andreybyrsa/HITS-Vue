import { TeamAccession, requestType } from '@Domain/TeamAccession'

interface TeamRequestModalEmits {
  (event: 'close-modal'): void
  (event: 'sendRequest', request: TeamAccession): void
  (event: 'reject', requestId: number): void
  (event: 'accept', requestId: number): void
}

interface TeamRequestModalProps {
  isOpened: boolean
  type: requestType
  mode: 'write' | 'read'
}

export { TeamRequestModalEmits, TeamRequestModalProps }
