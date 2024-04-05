import { ProjectMember, Sprint, Task } from '@Domain/Project'

interface FinishProjectOrSprintModalProps {
  isOpened: boolean
  members?: ProjectMember[]
  sprint?: Sprint
  unfinishedTasks?: Task[]
}

interface FinishProjectOrSprintModalEmits {
  (event: 'close-modal'): void
}

export { FinishProjectOrSprintModalEmits, FinishProjectOrSprintModalProps }
