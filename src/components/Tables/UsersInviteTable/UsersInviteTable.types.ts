import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'
import UsersSkills from '@Domain/UsersSkills'

interface UsersInviteTableProps {
  users: User[]
  skills: Skill[]
  usersSkills: UsersSkills[]
}

export type { UsersInviteTableProps }
