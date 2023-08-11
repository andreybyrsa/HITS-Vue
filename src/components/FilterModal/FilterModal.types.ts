interface FilterModalProps {
  isOpened: boolean
}

interface FilterModalEmits {
  (event: 'close-modal'): void
}

export { FilterModalProps, FilterModalEmits }
