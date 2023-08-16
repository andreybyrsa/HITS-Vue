import { User } from '@Domain/User'

interface InitialState {
  user: User | null
  loginError?: string
  registerError?: string
}

export default InitialState
