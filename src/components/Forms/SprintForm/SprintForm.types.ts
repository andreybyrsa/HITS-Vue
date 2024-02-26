import { Sprint } from '@Domain/Project'

interface SprintFormProps {
  sprint?: Sprint
}

interface SprintFormEmits {
  (event: 'close-modal'): void
}

export { SprintFormProps, SprintFormEmits }
