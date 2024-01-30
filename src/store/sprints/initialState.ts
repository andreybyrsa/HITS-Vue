import { Sprint } from '@Domain/Project'

interface InitialState {
  sprints: Sprint[]
  activeSprint?: Sprint
}

export default InitialState
