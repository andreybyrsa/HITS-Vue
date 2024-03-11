export interface ConfirmModalProps {
  isOpened: boolean
  textQuestion: string
  textButton: string
}

export interface ConfirmModalEmits {
  (event: 'close-modal'): void
  (evant: 'action'): () => void
}
