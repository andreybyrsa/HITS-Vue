import { TeamAccession, accessionStage, requestType } from '@Domain/TeamAccession'

interface TeamAccessionModalEmits {
  (event: 'closeModal'): void
  (event: 'sendRequest', request: TeamAccession): void
  (event: 'response'): void
  (event: 'invite'): void
}

interface TeamAccessionModalProps {
  isOpened: boolean
  type?: requestType
  mode: 'write' | 'read'
}

interface TeamAccessionButtonsEmits {
  (event: 'sendRequest'): void
  (event: 'response', stage: accessionStage): void
  (event: 'invite'): void
}

interface TeamAccessionButtonsProps {
  teamRequest?: TeamAccession
  mode: 'write' | 'read'
}

export {
  TeamAccessionModalEmits,
  TeamAccessionModalProps,
  TeamAccessionButtonsEmits,
  TeamAccessionButtonsProps,
}
