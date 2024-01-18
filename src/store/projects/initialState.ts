import { Project } from '@Domain/Project'

interface InitialState {
  project: Project | null
  projects: Project[]
  myProjects: Project[]
}

export default InitialState
