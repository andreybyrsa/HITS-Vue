interface CreateQuestModalProps {
  isOpened: boolean
  id: string | null
}

interface CreateQuestModalEmits {
  (event: 'close-modal'): void
}

export { CreateQuestModalProps, CreateQuestModalEmits }
