interface TableWindowProps {
  isOpened: number
  data: any
}

interface TableWindowEmits {
  (event: 'close-window'): void
}

export { TableWindowProps, TableWindowEmits }
