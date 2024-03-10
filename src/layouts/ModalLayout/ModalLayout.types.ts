export interface ModalLayoutProps {
  className?: string

  isOpened: boolean
  appearOnRender?: boolean
}

export interface ModalLayoutEmits {
  (event: 'on-outside-close'): void
}
