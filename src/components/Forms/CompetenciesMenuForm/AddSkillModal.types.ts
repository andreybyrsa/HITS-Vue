import { Skill } from '@Domain/Skill'

interface AddSkillModalProps {
  isOpened: boolean
  status: 'EDIT' | 'ADD'
  currentId?: string
}

interface AddSkillModalEmits {
  (event: 'close-modal'): void
  (event: 'save-skill', newSkil: Skill): void
}

export { AddSkillModalProps, AddSkillModalEmits }
