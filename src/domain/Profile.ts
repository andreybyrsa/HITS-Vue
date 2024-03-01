import { User, Skill, TeamExperience, Idea } from '@Domain'

export interface Profile extends User {
  skills: Skill[]
  ideas: Idea[]

  teams: TeamExperience[]
}

export interface ProfileFullName {
  lastName: string
  firstName: string
}
