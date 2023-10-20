import Team from '@Domain/Team'

interface ExchangeModalProps {
  isOpened: boolean
}

interface ExchangeModalEmits {
  (event: 'close-modal'): void
}

interface ExchangeTeamsProps {
  teams: Team[]
}

export { ExchangeModalProps, ExchangeModalEmits, ExchangeTeamsProps }
