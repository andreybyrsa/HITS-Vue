import { TaskMovementLog } from '@Domain/Project'

interface TaskHistoryModalProps {
  isOpened: boolean
  log: TaskMovementLog
}

interface TaskHistoryModalEmits {
  (event: 'close-modal'): void
}

export { TaskHistoryModalProps, TaskHistoryModalEmits }
