import { IdeaMarket } from '@Domain'

export interface RequestToIdeaModalProps {
  isOpened: boolean
  ideaMarket: IdeaMarket | null
}

export interface RequestToIdeaModalEmits {
  (event: 'close-modal'): void
}
