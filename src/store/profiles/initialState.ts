import { Profile } from '@Domain/Profile'
import { User, UserTelegram } from '@Domain/User'

type StoredAvatar = { id: string; avatar: string }

interface InitialState {
  avatars: StoredAvatar[]
  profiles: Profile[]
  usersTelegram: UserTelegram[]
}

export { InitialState, StoredAvatar, UserTelegram }
