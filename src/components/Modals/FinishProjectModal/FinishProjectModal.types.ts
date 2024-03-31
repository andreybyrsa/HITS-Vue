import { Project } from '@Domain/Project'

interface FinishProjectModalProps {
  isOpened: boolean
  isFinishProject?: boolean
  project: Project
}

interface FinishProjectModalEmits {
  (event: 'close-modal'): void
}

export { FinishProjectModalEmits, FinishProjectModalProps }
