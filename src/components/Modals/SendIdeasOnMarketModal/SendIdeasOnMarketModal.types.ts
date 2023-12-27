import { Idea } from '@Domain/Idea'

interface SendIdeasOnMarketModalProps {
  ideas: Idea[]
  isOpened: boolean
}

interface SendIdeasOnMarketModalEmits {
  (event: 'close-modal'): void
}

export { SendIdeasOnMarketModalProps, SendIdeasOnMarketModalEmits }
