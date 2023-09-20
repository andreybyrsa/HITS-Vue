interface DeleteModalProps {
  isOpened: boolean
}

interface DeleteModalEmits {
  (event: 'close-modal'): void
  (evant: 'delete'): void
}

export { DeleteModalProps, DeleteModalEmits }
