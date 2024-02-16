import { Project, Sprint, Task } from '@Domain/Project'

interface ProjectProps {
  project: Project
  sprint?: Sprint[]
  tasks?: Task[]
}

interface ActiveSprintProps {
  sprint: Sprint
}

interface SprintListProps {
  projectId: string
}

interface TaskProps {
  task: Task
}

export { ProjectProps, ActiveSprintProps, SprintListProps, TaskProps }
