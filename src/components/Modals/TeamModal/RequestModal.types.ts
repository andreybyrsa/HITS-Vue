interface Letter {
  text: string
  type: 'enter' | 'leave'
}

interface RequestModalEmits {
  (event: 'close-modal'): void
  (event: 'request', requestText: Letter): void
}

interface RequestModalProps {
  isOpened: boolean
  type: 'enter' | 'leave'
}

export { RequestModalEmits, RequestModalProps, Letter }
