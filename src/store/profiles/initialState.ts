import { Profile } from '@Domain/Profile'

type StoredAvatar = { id: string; avatar: string }

interface InitialState {
  avatars: StoredAvatar[]
  profiles: Profile[]
}

export { InitialState, StoredAvatar }
