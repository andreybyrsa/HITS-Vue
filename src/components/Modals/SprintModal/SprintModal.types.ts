interface SprintModalProps {
  isOpened: boolean
}

interface SprintModalEmits {
  (event: 'close-modal'): void
}

export { SprintModalProps, SprintModalEmits }
