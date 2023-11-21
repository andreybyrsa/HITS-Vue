import { User } from '@Domain/User'
import Profile from '@Domain/Profile'

interface ProfileAvatarProps {
  user: User
  avatar: FormData
  status: boolean
}

interface ProfileInfoProps {
  profile: Profile
}

interface ProfileSkillProps {
  profile: Profile
}

interface ProfileIdeasProps {
  profile: Profile
}

interface ProfileProjectsProps {
  profile: Profile
}

export {
  ProfileAvatarProps,
  ProfileInfoProps,
  ProfileSkillProps,
  ProfileIdeasProps,
  ProfileProjectsProps,
}
