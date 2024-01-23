interface FinishProjectModalProps {
  isOpened: boolean
  isFinishProject?: boolean
  status: 'SPRINT' | 'PROJECT'
}

interface FinishProjectModalEmits {
  (event: 'close-modal'): void
}

export { FinishProjectModalEmits, FinishProjectModalProps }
