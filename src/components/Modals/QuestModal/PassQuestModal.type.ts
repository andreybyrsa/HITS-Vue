interface PassQuestProps {
  idQuest: string
}

interface PassQuestEmits {
  (event: 'close-modal'): void
}

export { PassQuestProps, PassQuestEmits }
