import IdeasMarket from '@Domain/IdeasMarket'

interface RequestToIdeaModalProps {
  isOpened: boolean
  idea: IdeasMarket
}

interface RequestToIdeaModalEmits {
  (event: 'close-modal'): void
}

export { RequestToIdeaModalProps, RequestToIdeaModalEmits }
