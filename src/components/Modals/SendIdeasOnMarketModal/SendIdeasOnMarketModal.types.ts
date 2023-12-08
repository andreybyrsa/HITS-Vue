import { Idea } from '@Domain/Idea'

interface SendIdeasOnMarketModalProps {
  checkedIdeas: Idea[]
  isOpened: boolean
}

interface SendIdeasOnMarketModalEmits {
  (event: 'close-modal'): void
  (event: 'reset-checked-ideas'): void
}

export { SendIdeasOnMarketModalProps, SendIdeasOnMarketModalEmits }
