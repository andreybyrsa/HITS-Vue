import { Task, TaskMovementLog } from '@Domain/Project'
import { User } from '@Domain/User'

interface SprintTaskStatsPageProps {
  isOpened: boolean
  task: Task
  user: User
  logs: TaskMovementLog[]
}

interface SprintTaskStatsPageEmits {
  (event: 'close-modal'): void
}

export { SprintTaskStatsPageProps, SprintTaskStatsPageEmits }
