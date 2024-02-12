interface FinishSprintModalProps {
  isOpened: boolean
  isFinishSprint?: boolean
}

interface FinishSprintModalEmits {
  (event: 'close-modal'): void
}

export { FinishSprintModalEmits, FinishSprintModalProps }
