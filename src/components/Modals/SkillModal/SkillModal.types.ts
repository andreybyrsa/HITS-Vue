import { Skill } from '@Domain'

export interface SkillModalProps {
  isOpened: boolean
  skill?: Skill | null
}

export interface SkillModalEmits {
  (event: 'close-modal'): void
}
