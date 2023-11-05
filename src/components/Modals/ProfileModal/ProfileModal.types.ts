import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'
import { Idea } from '@Domain/Idea'
import Project from '@Domain/Project'

interface ProfileInfoProps {
  user: User
}

interface ProfileSkillProps {
  skills?: Skill[]
}

interface ProfileIdeasProps {
  ideas?: Idea[]
}

interface ProfileProjectsProps {
  projects?: Project[]
}

export {
  ProfileInfoProps,
  ProfileSkillProps,
  ProfileIdeasProps,
  ProfileProjectsProps,
}
