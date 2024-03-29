import { Team } from '@Domain/Team'

interface Survey360FormProps {
  team?: Team
}

interface Survey360FormEmits {
  (event: 'close-modal'): void
}

export { Survey360FormProps, Survey360FormEmits }
