import { ProjectMember } from '@Domain/Project'

interface ProjectExprienceModalProps {
  isOpened: boolean
  teamName: string
  teamProject: ProjectMember[]
}

interface RequestToIdeaModalEmits {
  (event: 'close-modal'): void
}

export { RequestToIdeaModalEmits, ProjectExprienceModalProps }
