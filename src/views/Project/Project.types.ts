import { Project, Sprint, Task, TaskStatus } from '@Domain/Project'

type SizeType = 'STANDART' | 'SMALL'

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
  size?: SizeType
}

interface ActiveSprintTaskProps {
  task: Task
}

interface ColumnTask {
  name: TaskStatus
  tasks: Task[]
}

export {
  ProjectProps,
  SprintListProps,
  TaskProps,
  SizeType,
  ActiveSprintTaskProps,
  ColumnTask,
}
