import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'
import { Idea } from '@Domain/Idea'
import { TeamExperience } from '@Domain/Team'

interface Profile extends User {
  skills: Skill[]
  ideas: Idea[]

  teams: TeamExperience[]
}

interface ProfileFullName {
  lastName: string
  firstName: string
  studyGroup: string
  telephone: string
}

export { Profile, ProfileFullName }
