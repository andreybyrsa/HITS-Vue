import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'
import { Idea } from '@Domain/Idea'
import { Team, TeamExperience } from '@Domain/Team'
import { ProjectMember } from '@Domain/Project'

interface Profile extends User {
  skills: Skill[]
  ideas: Idea[]
  team: Team
  // поля name, description, closed

  teamsExperience: TeamExperience[]
  teamsProjects: ProjectMember[]
}

interface ProfileFullName {
  lastName: string
  firstName: string
}

export { Profile, ProfileFullName }
