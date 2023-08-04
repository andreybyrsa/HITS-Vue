import { User, LoginUser } from '@Domain/User'

interface InitialState {
  user: User | LoginUser | null
}

export default InitialState
