import { Project, Sprint, Task } from '@Domain/Project'

interface ProjectProps {
  project: Project
  sprint?: Sprint[]
  tasks?: Task[]
}

interface ActiveSprintProps {
  sprint: Sprint
}

export { ProjectProps, ActiveSprintProps }
