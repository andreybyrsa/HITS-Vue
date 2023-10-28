import { Skill } from '@Domain/Skill'

interface Profile {
  userId: number
  userEmail: string
  firstName: string
  lastName: string
  skills: Skill[]
}

export default Profile
