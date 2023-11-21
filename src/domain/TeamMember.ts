import { Skill } from '@Domain/Skill'

interface TeamMember {
  id: string
  email: string
  firstName: string
  lastName: string

  skills: Skill[]
}

export default TeamMember
