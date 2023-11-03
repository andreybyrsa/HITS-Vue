import Team from '@Domain/Team'
import { FieldEntry } from 'vee-validate'

interface RequestTeamCollapseProps {
  teams: Team[]
  fields: FieldEntry<string>[]
  submitCount: number
}

interface RequestTeamCollapseEmits {
  (event: 'send-request'): void
  (event: 'push-letter', letter: string): void
}

export { RequestTeamCollapseProps, RequestTeamCollapseEmits }
