import { IdeaMarket } from '@Domain/IdeaMarket'
import { Market } from '@Domain/Market'

interface IdeaMarketCardProps {
  ideaMarket: IdeaMarket
  isAllIdeas: boolean
}

interface IdeasMarketHeaderProps {
  market: Market | null
  isAllIdeas: boolean
}

interface IdeaMarketCardEmits {
  (event: 'send-quick-request', idea: IdeaMarket): void
}

interface IdeasMarketHeaderEmits {
  (event: 'switch-to-all', value?: boolean, callback?: () => Promise<void>): void
  (
    event: 'switch-to-favourites',
    value?: boolean,
    callback?: () => Promise<void>,
  ): void
}

export {
  IdeaMarketCardProps,
  IdeasMarketHeaderProps,
  IdeaMarketCardEmits,
  IdeasMarketHeaderEmits,
}
