import { Task } from '@Domain/Project'

interface SprintModalProps {
  isOpened: boolean
  projectId: string
  tasks?: Task[]
}

interface SprintModalEmits {
  (event: 'close-modal'): void
}

export { SprintModalProps, SprintModalEmits }
