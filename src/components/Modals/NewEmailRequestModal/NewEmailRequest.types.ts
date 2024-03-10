export interface NewEmailRequestProps {
  isOpened: boolean
}

export interface NewEmailRequestEmits {
  (event: 'close-modal'): void
}
