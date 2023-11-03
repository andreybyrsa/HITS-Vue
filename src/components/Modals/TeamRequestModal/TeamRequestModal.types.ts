import { TeamAccession, requestType } from '@Domain/TeamAccession'

interface TeamRequestModalEmits {
  (event: 'close-modal'): void
  (event: 'sendRequest', request: TeamAccession): void
  (event: 'reject'): void
  (event: 'accept'): void
}

interface TeamRequestModalProps {
  teamRequest?: TeamAccession
  isOpened: boolean
  type?: requestType
  mode: 'write' | 'read'
}

export { TeamRequestModalEmits, TeamRequestModalProps }
