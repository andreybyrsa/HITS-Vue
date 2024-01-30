import { Project, Sprint, Task } from '@Domain/Project'

interface ProjectProps {
  project: Project
  sprint?: Sprint[]
  tasks?: Task[]
}

// interface elemKanbanProps {

// }

export { ProjectProps }
