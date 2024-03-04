import { IdeaMarket } from '@Domain'

export interface LetterModalProps {
  isOpened: boolean
  ideaMarket?: IdeaMarket
  letter?: string
}

export interface LetterModalEmits {
  (event: 'close-modal'): void
  (event: 'accept-request'): void
}
