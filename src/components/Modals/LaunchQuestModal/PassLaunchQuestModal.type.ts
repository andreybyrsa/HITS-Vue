import { LaunchQuest } from '@Domain/Quest'

interface PassLaunchQuestProps {
  isOpened: boolean
  launchQuest: LaunchQuest | null
}

interface PassLaunchQuestEmits {
  (event: 'close-modal'): void
}

export { PassLaunchQuestProps, PassLaunchQuestEmits }
