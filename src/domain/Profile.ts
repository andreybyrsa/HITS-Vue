import { Skill } from '@Domain/Skill'

interface ProfileSkills {
  id: string
  userId: string
  skills: Skill[]
}

export { ProfileSkills }
