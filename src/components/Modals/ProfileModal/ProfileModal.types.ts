import { User } from '@Domain/User'

interface ProfileModalProps {
  canGoBack?: boolean
}

interface ProfileAvatarProps {
  user: User
  avatar: FormData
  status: boolean
}

export { ProfileModalProps, ProfileAvatarProps }
