import { Project, ProjectMember, Sprint, SprintMarks, Task } from '@Domain/Project'

export interface SprintInfoModalProps {
  isOpened: boolean
  sprintId: string
  project: Project
}

export interface SprintInfoHeaderProps {
  sprintName: string
}

export interface SprintInfoTasksProps {
  tasks: Task[]
  members: ProjectMember[]
}

export interface SprintInfoContentProps {
  sprint: Sprint
  sprintMarks: SprintMarks[]
  task?: Task
}

export interface SprintInfoModalEmits {
  (event: 'close-modal'): void
}
