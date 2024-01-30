interface CreateNewTaskProps {
  isOpened: boolean
}

interface CreateTaskModalEmits {
  (event: 'close-modal'): void
}

export { CreateNewTaskProps, CreateTaskModalEmits }
