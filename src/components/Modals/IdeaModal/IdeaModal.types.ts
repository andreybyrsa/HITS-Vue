interface IdeaModalProps {
  isOpened: boolean
}

interface IdeaModalEmits {
  (event: 'close-modal'): void
}

export { IdeaModalProps, IdeaModalEmits }
