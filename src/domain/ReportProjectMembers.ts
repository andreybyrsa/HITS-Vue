import { ProjectMemberRole, Task } from '@Domain/Project'

interface ReportProject {
  projectId: string
  marks: AverageMark[]
  report: string
}

interface AverageMark {
  id: string
  projectId: string
  userID: string
  firstName: string
  lastName: string
  projectRole: ProjectMemberRole
  mark: string
}

export { ReportProject, AverageMark }
