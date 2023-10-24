import { Rating } from '@Domain/Idea'

interface InitialState {
  ratings: { ideaId: number; ratings: Rating[] }[]
}

export default InitialState
