import IdeaMarket from '@Domain/IdeaMarket'

interface RequestToIdeaModalProps {
  isOpened: boolean
  idea: IdeaMarket | null
}

interface RequestToIdeaModalEmits {
  (event: 'close-modal'): void
}

export { RequestToIdeaModalProps, RequestToIdeaModalEmits }
