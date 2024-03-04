import { IdeaMarket, Market } from '@Domain'

export interface IdeaMarketCardProps {
  ideaMarket: IdeaMarket
  isAllIdeas: boolean
}

export interface IdeasMarketHeaderProps {
  market: Market | null
  isAllIdeas: boolean
}

export interface IdeaMarketCardEmits {
  (event: 'send-quick-request', idea: IdeaMarket): void
}

export interface IdeasMarketHeaderEmits {
  (event: 'switch-to-all', value?: boolean, callback?: () => Promise<void>): void
  (
    event: 'switch-to-favourites',
    value?: boolean,
    callback?: () => Promise<void>,
  ): void
}
