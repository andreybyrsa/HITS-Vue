interface FinishProjectModalProps {
  isOpened: boolean
  isFinishProject?: boolean
  status: 'SPRINT' | 'PROJECT' | 'PROJECTINFO'
}

interface FinishProjectModalEmits {
  (event: 'close-modal'): void
}

export { FinishProjectModalEmits, FinishProjectModalProps }
