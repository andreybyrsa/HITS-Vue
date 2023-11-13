import { Rating } from '@Domain/Idea'

interface InitialState {
  ratings: { ideaId: number; ideaRatings: Rating[] }[]
}

export default InitialState
