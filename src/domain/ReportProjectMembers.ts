import { ProjectMemberRole, Task } from '@Domain/Project'

interface ReportProject {
  projectId: string
  marks: AverageMark[]
  report: string
}

interface AverageMark {
  projectId: string
  userId: string
  firstName: string
  lastName: string
  projectRole: ProjectMemberRole
  mark: number
  tasks?: Task[]
}

export { ReportProject, AverageMark }
