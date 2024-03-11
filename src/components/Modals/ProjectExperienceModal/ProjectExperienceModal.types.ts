import { ProjectMember } from '@Domain'

export interface ProjectExprienceModalProps {
  isOpened: boolean
  teamName: string
  teamProject: ProjectMember[]
}

export interface RequestToIdeaModalEmits {
  (event: 'close-modal'): void
}
