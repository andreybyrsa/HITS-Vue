interface DeleteModalProps {
  ideaId: string
  isOpened: boolean
}

interface DeleteModalEmits {
  (event: 'close-modal'): void
}

export { DeleteModalProps, DeleteModalEmits }
