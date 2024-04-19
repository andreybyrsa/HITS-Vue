import { Project, ProjectMember, Sprint, Task, TaskStatus } from '@Domain/Project'

interface ProjectProps {
  project: Project
  sprint?: Sprint[]
  tasks?: Task[]
}

interface SprintListProps {
  project: Project
}

interface TaskProps {
  task: Task
  small?: boolean
}

interface ActiveSprintTaskProps {
  task: Task
}

interface ColumnTask {
  name: TaskStatus
  tasks: Task[]
}

interface ActiveSprintProps {
  members: ProjectMember[]
}

export {
  ProjectProps,
  SprintListProps,
  TaskProps,
  ActiveSprintTaskProps,
  ColumnTask,
  ActiveSprintProps,
}
