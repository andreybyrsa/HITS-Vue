import { Skill } from './Skill'

interface TeamMember {
  id: number
  email: string
  firstName: string
  lastName: string

  skills: Skill[]
}

export default TeamMember
