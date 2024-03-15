import { User } from '@Domain/User'
import { Team } from '@Domain/Team'
import { Tag } from '@Domain/Tag'
import { ReportProject } from './ReportProjectMembers'

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

  report: ReportProject
  startDate: string
  finishDate: string
  status: ProjectStatus
}

interface ProjectMember {
  teamId: string
  teamName: string
  projectName: string
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
  task: Task
  executor: User | null
  user: User
  startDate: string
  endDate: string
  taskStatus: TaskStatus
}

interface Task {
  id: string
  sprintId?: string
  projectId: string
  position: number
  name: string
  description: string
  leaderComment?: string

  initiator: User
  executor: User | null
  workHour: string
  startDate: string
  finishDate?: string

  tag: Tag[]
  taskMovementLog: TaskStatus[]
  status: TaskStatus
}

type SprintStatus = 'ACTIVE' | 'DONE'

interface Sprint {
  id: string
  projectId: string
  name: string
  goal?: string
  marks: SprintMarks[]
  report: string
  startDate: string
  finishDate: string
  workingHours: string
  status: SprintStatus
  tasks: Task[]
}

interface SprintMarks {
  sprintId: string
  userId: string
  firstName: string
  lastName: string
  projectRole: ProjectMemberRole
  mark: number | undefined
  tasks?: Task[]
}

export {
  Project,
  ProjectMember,
  ProjectStatus,
  ProjectMemberRole,
  SprintStatus,
  Sprint,
  SprintMarks,
  Task,
  TaskStatus,
  TaskMovementLog,
}
