import { User } from '@Domain/User'
import { Team } from '@Domain/Team'

type ProjectStatus = 'ACTIVE' | 'DONE'
type ProjectMemberRole = 'INITIATOR' | 'TEAM_LEADER' | 'MEMBER'
type TaskStatus =
  | 'InBackLog'
  | 'OnModification'
  | 'NewTask'
  | 'inProgress'
  | 'OnVerification'
  | 'Done'

interface Project {
  id: string

  name: string
  description: string
  customer: string
  initiator: User
  team: Team
  members: ProjectMember[]

  logs: TaskMovementLog[]
  report: string
  startDate: string
  finishDate: string
  status: ProjectStatus
}

interface ProjectMember {
  userId: string
  email: string
  firstName: string
  lastName: string
  projectRole: ProjectMemberRole
  startDate: string
  finishDate: string
}

interface TaskMovementLog {
  id: string
  projectId: string
  taskId: string
  taskName: Task
  taskDescription: Task
  executor: User
  initiator: User
  editDate: string
  tag: Task
  currentPosition: Task
}

interface Task {
  id: string
  sprintId: string
  projectId: string
  name: string
  description: string

  initiator: User
  executor: User
  workHour: string
  startDate: string
  finishDate: string

  tag: string
  taskMovementLog: TaskStatus[]
  status: TaskStatus
}

export { Project, ProjectMember, ProjectStatus, ProjectMemberRole }
