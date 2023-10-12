interface JoinIdeaModalProps {
  isOpened: boolean
}

interface JoinIdeaModalEmits {
  (event: 'close-modal'): void
}

export { JoinIdeaModalProps, JoinIdeaModalEmits }
