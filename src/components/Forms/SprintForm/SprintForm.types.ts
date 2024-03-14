import { Project, Sprint } from '@Domain/Project'

interface SprintFormProps {
  project: Project
  sprint?: Sprint
}

interface SprintFormEmits {
  (event: 'close-modal'): void
}

export { SprintFormProps, SprintFormEmits }
