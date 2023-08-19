interface ModalLayoutProps {
  className?: string

  isOpened: boolean
}

interface ModalLayoutEmits {
  (event: 'on-outside-close'): void
}

export { ModalLayoutProps, ModalLayoutEmits }
