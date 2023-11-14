import { Idea } from '@Domain/Idea'
import { User } from '@Domain/User'

interface CustomerAndContact {
  idea: Idea
}

interface CustomerAndContactEmits {
  (
    event: 'set-value',
    field: keyof Idea,
    value: User | number,
    shouldValidate?: boolean,
  ): void
}

export { CustomerAndContact, CustomerAndContactEmits }
