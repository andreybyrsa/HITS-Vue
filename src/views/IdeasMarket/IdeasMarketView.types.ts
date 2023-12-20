import { IdeaMarket } from '@Domain/IdeaMarket'
import { Market } from '@Domain/Market'

interface IdeaCardProps {
  idea: IdeaMarket
  market: Market
  isAllIdeas: boolean
}

interface IdeaCardEmits {
  (event: 'send-quick-request', idea: IdeaMarket): void
}

export { IdeaCardProps, IdeaCardEmits }
