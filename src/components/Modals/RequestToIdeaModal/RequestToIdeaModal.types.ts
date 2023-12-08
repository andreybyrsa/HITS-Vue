import IdeaMarket from '@Domain/IdeaMarket'

interface RequestToIdeaModalProps {
  isOpened: boolean
  ideaMarket: IdeaMarket | null
}

interface RequestToIdeaModalEmits {
  (event: 'close-modal'): void
}

export { RequestToIdeaModalProps, RequestToIdeaModalEmits }
