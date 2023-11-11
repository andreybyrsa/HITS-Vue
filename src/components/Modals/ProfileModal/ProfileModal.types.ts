import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'
import { Idea } from '@Domain/Idea'
import Project from '@Domain/Project'

interface ProfileAvatarProps {
  user: User
  status: boolean
}

interface ProfileInfoProps {
  user: User
  status: boolean
}

interface ProfileSkillProps {
  skills?: Skill[]
  status: boolean
}

interface ProfileIdeasProps {
  ideas?: Idea[]
}

interface ProfileProjectsProps {
  projects?: Project[]
}

export {
  ProfileAvatarProps,
  ProfileInfoProps,
  ProfileSkillProps,
  ProfileIdeasProps,
  ProfileProjectsProps,
}
