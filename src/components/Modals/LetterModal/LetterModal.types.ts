interface LetterModalProps {
  isOpened: boolean
  letter: string
}

interface LetterModalEmits {
  (event: 'close-modal'): void
  (event: 'accept-request'): void
}

export { LetterModalProps, LetterModalEmits }
