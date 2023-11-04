import IdeasMarket from '@Domain/IdeasMarket'
import ApplicationTeams from '@Domain/RequestTeams'

interface MarketModalProps {
  isOpened: boolean
}

interface MarketDescriptionProps {
  idea: IdeasMarket
}

interface MarketModalEmits {
  (event: 'close-modal'): void
}

interface MarketAcceptTeamProps {
  teams?: ApplicationTeams[]
}

interface MarketInfoProps {
  idea: IdeasMarket
}

export {
  MarketModalProps,
  MarketDescriptionProps,
  MarketModalEmits,
  MarketAcceptTeamProps,
  MarketInfoProps,
}
