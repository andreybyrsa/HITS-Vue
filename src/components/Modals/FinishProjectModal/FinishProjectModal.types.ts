import { ProjectMember, Sprint } from '@Domain/Project'

interface FinishProjectModalProps {
  isOpened: boolean
  members: ProjectMember[]
  sprint?: Sprint
}

interface FinishProjectModalEmits {
  (event: 'close-modal'): void
}

export { FinishProjectModalEmits, FinishProjectModalProps }
