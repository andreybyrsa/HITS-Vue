import { ProjectMemberRole } from '@Domain/Project'

interface FinishProjectModalProps {
  isOpened: boolean
}

interface FinishProjectModalEmits {
  (event: 'close-modal'): void
}

interface membersType {
  score: string
  name: string
  role: ProjectMemberRole
}
export { FinishProjectModalEmits, FinishProjectModalProps, membersType }
