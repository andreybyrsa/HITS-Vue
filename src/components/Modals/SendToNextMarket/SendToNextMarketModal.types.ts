import { IdeaMarket } from '@Domain/IdeaMarket'

interface SendToNextMarketModalProps {
  checkedIdeasMarket: IdeaMarket[]
  isOpened: boolean
}

interface SendToNextMarketModalEmits {
  (event: 'close-modal'): void
  (event: 'reset-no-team-ideas'): void
}

export { SendToNextMarketModalProps, SendToNextMarketModalEmits }
