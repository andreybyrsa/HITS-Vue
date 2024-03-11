import { Idea } from '@Domain'

export interface SendIdeasOnMarketModalProps {
  ideas: Idea[]
  isOpened: boolean
}

export interface SendIdeasOnMarketModalEmits {
  (event: 'close-modal'): void
}
