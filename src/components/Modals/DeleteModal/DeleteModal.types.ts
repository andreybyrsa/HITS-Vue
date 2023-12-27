interface DeleteModalProps {
  isOpened: boolean
  itemName?: string
}

interface DeleteModalEmits {
  (event: 'close-modal'): void
  (evant: 'delete'): void
}

export { DeleteModalProps, DeleteModalEmits }
