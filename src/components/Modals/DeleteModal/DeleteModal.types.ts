export interface DeleteModalProps {
  isOpened: boolean
  itemName?: string
}

export interface DeleteModalEmits {
  (event: 'close-modal'): void
  (evant: 'delete'): void
}
