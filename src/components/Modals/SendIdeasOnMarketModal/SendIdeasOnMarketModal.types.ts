import { Idea } from '@Domain/Idea'

interface SendIdeasOnMarketModalProps {
  isOpened: boolean
  ideas: Idea[]
}

interface SendIdeasOnMarketModalEmits {
  (event: 'close-modal'): void
  (event: 'send-ideas-on-market'): void
}

export { SendIdeasOnMarketModalProps, SendIdeasOnMarketModalEmits }
