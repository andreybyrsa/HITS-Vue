import { TaskMovementLog } from '@Domain/Project'

interface TaskHistoryModalProps {
  isOpened: boolean
  log: TaskMovementLog | undefined
}

interface TaskHistoryModalEmits {
  (event: 'close-modal'): void
}

export { TaskHistoryModalProps, TaskHistoryModalEmits }
