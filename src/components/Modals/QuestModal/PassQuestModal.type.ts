import { Quest } from '@Domain/Quest'

interface PassQuestProps {
  isOpened: boolean
  launchQuest: Quest | null
}

interface PassQuestEmits {
  (event: 'close-modal'): void
}

export { PassQuestProps, PassQuestEmits }
