import { IdeaMarket } from '@Domain/IdeaMarket'
import { Market } from '@Domain/Market'

interface ReturnIdeasMarketModalProps {
  market: Market
  ideasMarket: IdeaMarket[]
  isOpened: boolean
}

interface ReturnIdeasMarketModalEmits {
  (event: 'close-modal'): void
}

export { ReturnIdeasMarketModalProps, ReturnIdeasMarketModalEmits }
