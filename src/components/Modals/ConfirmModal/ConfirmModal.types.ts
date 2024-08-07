interface ConfirmModalProps {
  isOpened: boolean
  textQuestion: string
  textButton: string
  textNotDanger?: boolean
}

interface ConfirmModalEmits {
  (event: 'close-modal'): void
  (evant: 'action'): () => void
}

export { ConfirmModalProps, ConfirmModalEmits }
