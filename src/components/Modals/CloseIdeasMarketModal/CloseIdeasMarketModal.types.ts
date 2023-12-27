import { IdeaMarket } from '@Domain/IdeaMarket'
import { Market } from '@Domain/Market'

interface CloseIdeasMarketModalProps {
  isOpened: boolean
  market: Market
  ideasMarket: IdeaMarket[]
}

interface CloseIdeasMarketModalEmits {
  (event: 'close-modal'): void
}

export { CloseIdeasMarketModalProps, CloseIdeasMarketModalEmits }
