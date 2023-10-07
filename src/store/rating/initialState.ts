import { Rating } from '@Domain/Idea'

interface InitialState {
  ratings: { ideaId: string; ratings: Rating[] }[]
}

export default InitialState
