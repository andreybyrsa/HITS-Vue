interface DeleteModalProps {
  ideaId: number
  isOpened: boolean
}

interface DeleteModalEmits {
  (event: 'close-modal'): void
}

export { DeleteModalProps, DeleteModalEmits }
