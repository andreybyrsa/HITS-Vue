interface CreateNewTaskProps {
  isOpened: boolean
  isActiveSprint?: boolean
}

interface CreateTaskModalEmits {
  (event: 'close-modal'): void
}

export { CreateNewTaskProps, CreateTaskModalEmits }
