import { Project, Sprint } from '@Domain/Project'

interface SprintModalProps {
  isOpened: boolean
  project: Project
  sprint?: Sprint
}

interface SprintModalEmits {
  (event: 'close-modal'): void
}

export { SprintModalProps, SprintModalEmits }
