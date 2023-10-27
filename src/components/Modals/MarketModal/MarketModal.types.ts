import Market from '@Domain/Market'
import ApplicationTeams from '@Domain/RequestTeams'

interface MarketModalProps {
  isOpened: boolean
}

interface MarketDescriptionProps {
  idea: Market
}

interface MarketModalEmits {
  (event: 'close-modal'): void
}

interface MarketAcceptTeamProps {
  teams?: ApplicationTeams[]
}

interface MarketInfoProps {
  idea: Market
}

export {
  MarketModalProps,
  MarketDescriptionProps,
  MarketModalEmits,
  MarketAcceptTeamProps,
  MarketInfoProps,
}
