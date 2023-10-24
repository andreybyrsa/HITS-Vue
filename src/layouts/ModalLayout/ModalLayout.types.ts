interface ModalLayoutProps {
  className?: string

  isOpened: boolean
  appearOnRender?: boolean
}

interface ModalLayoutEmits {
  (event: 'on-outside-close'): void
}

export { ModalLayoutProps, ModalLayoutEmits }
