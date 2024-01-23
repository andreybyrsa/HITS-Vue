import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'
import { Idea } from '@Domain/Idea'
import { TeamExperience } from '@Domain/Team'
import { ProjectMember } from '@Domain/Project'

interface Profile extends User {
  skills: Skill[]
  ideas: Idea[]

  teamsExperience: TeamExperience[]
  teamsProjects: ProjectMember[]

  userTag: string
  isUserTagVisible: boolean
}

interface ProfileFullName {
  lastName: string
  firstName: string
}

export { Profile, ProfileFullName }
