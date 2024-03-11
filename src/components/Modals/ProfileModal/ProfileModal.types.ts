import { User } from '@Domain'

export interface ProfileModalProps {
  canGoBack?: boolean
}

export interface ProfileAvatarProps {
  user: User
  avatar: FormData
  status: boolean
}
