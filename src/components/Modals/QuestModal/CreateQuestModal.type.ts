import { Team } from '@Domain/Team'

interface CreateLaunchQuestProps {
  isOpened: boolean
  teams: Team[]
}

interface CreateLaunchQuestEmits {
  (event: 'close-modal'): void
}

export { CreateLaunchQuestProps, CreateLaunchQuestEmits }
