interface QuestModalProps {
  isOpened: boolean
  idQuest: string | null
}

interface QuestModalEmits {
  (event: 'close-modal'): void
}

export { QuestModalProps, QuestModalEmits }
