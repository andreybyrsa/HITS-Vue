import { Project, Sprint, Task } from '@Domain/Project'

interface SprintInfoModalProps {
  isOpened: boolean
  isSprinInfoModal?: boolean
  sprint: Sprint
  task?: Task
  project?: Project
}

interface SprintInfoModalEmits {
  (event: 'close-modal'): void
}

export { SprintInfoModalEmits, SprintInfoModalProps }
