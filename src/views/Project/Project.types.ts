import Company from '@Domain/Company'
import { Project } from '@Domain/Project'
import { User } from '@Domain/User'

interface ProjectProps {
  project: Project
}

interface ProjectInfoProps {
  initiator: User
  customer: string
  startDate: string
  finishDate: string
}

export { ProjectInfoProps }
export { ProjectProps }
