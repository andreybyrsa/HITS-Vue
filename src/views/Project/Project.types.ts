import { Project, Sprint, Task } from '@Domain/Project'

interface ProjectProps {
  project: Project
  sprint?: Sprint[]
  tasks?: Task[]
}

export { ProjectProps }
