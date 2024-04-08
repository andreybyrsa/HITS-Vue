import { Task } from '@Domain/Project'
import { User } from '@Domain/User'

interface SprintTaskStatsPageProps {
  isOpened: boolean
  task: Task
  user: User
}

interface SprintTaskStatsPageEmits {
  (event: 'close-modal'): void
}

export { SprintTaskStatsPageProps, SprintTaskStatsPageEmits }
