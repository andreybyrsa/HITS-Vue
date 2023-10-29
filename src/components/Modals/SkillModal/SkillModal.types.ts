import { Skill } from '@Domain/Skill'

interface SkillModalProps {
  isOpened: boolean
  skill?: Skill | null
}

interface SkillModalEmits {
  (event: 'close-modal'): void
}

export { SkillModalProps, SkillModalEmits }
