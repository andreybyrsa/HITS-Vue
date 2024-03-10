import { Market, IdeaMarket } from '@Domain'

export interface CloseIdeasMarketModalProps {
  isOpened: boolean
  market: Market
  ideasMarket: IdeaMarket[]
}

export interface CloseIdeasMarketModalEmits {
  (event: 'close-modal'): void
}
