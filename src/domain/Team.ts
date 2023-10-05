import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'
import { Portfolio } from '@Components/Modals/TeamModal/TeamAction.types'

interface Team {
  id: string
  name: string
  description: string
  owner: User
  leader: User
  members: User[]
  skills: Skill[]
  isAvailable: boolean
  portfolio: Portfolio[]
}

export default Team
