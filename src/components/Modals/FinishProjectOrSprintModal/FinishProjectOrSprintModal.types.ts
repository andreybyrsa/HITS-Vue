import { Project, Sprint, Task } from '@Domain/Project'

interface FinishProjectOrSprintModalProps {
  isOpened: boolean
  project?: Project
  sprint?: Sprint
  unfinishedTasks?: Task[]
}

interface FinishProjectOrSprintModalEmits {
  (event: 'close-modal'): void
}

export { FinishProjectOrSprintModalEmits, FinishProjectOrSprintModalProps }
