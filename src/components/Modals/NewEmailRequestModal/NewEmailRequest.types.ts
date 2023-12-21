interface NewEmailRequestProps {
  isOpened: boolean
}

interface NewEmailRequestEmits {
  (event: 'close-modal'): void
}

export { NewEmailRequestProps, NewEmailRequestEmits }
