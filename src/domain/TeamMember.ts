import { Skill } from '@Domain/Skill'

interface TeamMember {
  userId: number
  email: string
  firstName: string
  lastName: string

  skills: Skill[]
}

export default TeamMember
