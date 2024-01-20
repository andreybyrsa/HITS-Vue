interface FinishProjectModalProps {
  isOpened: boolean
}

interface FinishProjectModalEmits {
  (event: 'close-modal'): void
}

export { FinishProjectModalEmits, FinishProjectModalProps }
