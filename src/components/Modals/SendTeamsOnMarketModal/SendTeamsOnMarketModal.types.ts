import { Team } from '@Domain/Team'

interface SendTeamsOnMarketModalProps {
  teams: Team[]
  isOpened: boolean
}

interface SendTeamsOnMarketModalEmits {
  (event: 'close-modal'): void
}

export { SendTeamsOnMarketModalProps, SendTeamsOnMarketModalEmits }
