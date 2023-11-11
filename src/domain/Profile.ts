import { Idea } from './Idea'
import Project from './Project'
import { Skill } from './Skill'
import { User } from './User'

interface Profile extends User {
  skills: Skill[]
  ideas: Idea[]
  projects: Project[]
}

export default Profile
