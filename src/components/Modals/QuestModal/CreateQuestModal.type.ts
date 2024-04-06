interface CreateQuestModalProps {
  isOpened: boolean
  idQuest: string | null
}

interface CreateQuestModalEmits {
  (event: 'close-modal'): void
}

export { CreateQuestModalProps, CreateQuestModalEmits }
