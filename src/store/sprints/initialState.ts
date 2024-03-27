import { Sprint } from '@Domain/Project'

interface InitialState {
  sprints: Sprint[]
  activeSprint?: Sprint
  sprintById?: Sprint
}

export default InitialState
