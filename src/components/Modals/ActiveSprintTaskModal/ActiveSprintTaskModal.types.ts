import { Task } from '@Domain/Project'

export interface TaskDataProps {
  task: Task
}

export interface TaskHistoryProps {
  taskId: string
}

export interface TaskHeaderEmits {
  (event: 'close-modal'): void
}

export interface TaskCommentsEmits {
  (event: 'update-leader-comment', input: string): void
  (event: 'update-executor-comment', input: string): void
}
