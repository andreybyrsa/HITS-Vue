import { IdeaMarket } from '@Domain/IdeaMarket'

interface LetterModalProps {
  isOpened: boolean
  ideaMarket?: IdeaMarket
  letter?: string
}

interface LetterModalEmits {
  (event: 'close-modal'): void
  (event: 'accept-request'): void
}

export { LetterModalProps, LetterModalEmits }
