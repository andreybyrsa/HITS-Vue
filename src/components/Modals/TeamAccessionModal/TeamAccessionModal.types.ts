import { TeamAccession, accessionStage, requestType } from '@Domain/TeamAccession'

interface TeamAccessionModalEmits {
  (event: 'closeModal'): void
  (event: 'sendRequest', request: TeamAccession): void
  (event: 'responseToRequest', teamAccession: TeamAccession): void
  (event: 'responseToInvitation', teamAccession: TeamAccession): void
  (event: 'invite'): void
}

interface TeamAccessionModalProps {
  isOpened: boolean
  type?: requestType
  mode: 'write' | 'read'
}

interface TeamAccessionButtonsEmits {
  (event: 'sendRequest'): void
  (event: 'responseToRequest', stage: accessionStage): void
  (event: 'responseToInvitation', stage: accessionStage): void
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
