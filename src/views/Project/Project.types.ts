import { Project, Sprint, Task } from '@Domain/Project'

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

export { ProjectProps, SprintListProps, TaskProps, SizeType }
