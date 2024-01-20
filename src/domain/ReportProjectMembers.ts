import { ProjectMemberRole } from '@Domain/Project'

interface ReportProject {
  projectId: string
  marks: AverageMark[]
  report: string
}

interface AverageMark {
  projectId: string
  userID: string
  firstName: string
  lastName: string
  projectRole: ProjectMemberRole
  mark: string
}

export { ReportProject, AverageMark }
