import { Rating } from '@Domain/Idea'

interface InitialState {
  ratings: { ideaId: string; ideaRatings: Rating[] }[]
}

export default InitialState
