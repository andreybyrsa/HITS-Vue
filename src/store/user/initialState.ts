import { User, UserMetadata } from '@Domain/User'

interface InitialState {
  user: User | null
  metadata: UserMetadata | null
}

export default InitialState
