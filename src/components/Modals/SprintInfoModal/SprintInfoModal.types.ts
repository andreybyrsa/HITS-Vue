import { Project, Sprint } from '@Domain/Project'

interface SprintInfoModalProps {
  isOpened: boolean
  isSprinInfoModal?: boolean
  sprint: Sprint
  project?: Project
}

interface SprintInfoModalEmits {
  (event: 'close-modal'): void
}

export { SprintInfoModalEmits, SprintInfoModalProps }
