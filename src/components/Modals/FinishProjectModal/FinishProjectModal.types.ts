interface FinishProjectModalProps {
  isOpened: boolean
  isFinishProject?: boolean
  status: 'PROJECT' | 'PROJECTINFO'
}

interface FinishProjectModalEmits {
  (event: 'close-modal'): void
}

export { FinishProjectModalEmits, FinishProjectModalProps }
