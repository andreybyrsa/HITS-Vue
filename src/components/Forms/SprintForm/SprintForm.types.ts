import { Sprint } from '@Domain/Project'

interface SprintFormProps {
  sprint?: Sprint
  projectId: string
}

// interface SprintEmits {
//   (
//     event: 'set-value',
//     field: keyof Team,
//     value: string | number,
//     shouldValidate?: boolean,
//   ): void
// }

export { SprintFormProps }
