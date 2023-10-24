import { Skill } from './Skill'

interface TeamMember {
  email: string
  firstName: string
  lastName: string

  skills: Skill[]
}

export default TeamMember
