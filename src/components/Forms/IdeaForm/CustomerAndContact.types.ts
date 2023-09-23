import { Idea } from '@Domain/Idea'

interface CustomerAndContact {
  idea: Idea
}

interface CustomerAndContactEmits {
  (
    event: 'set-value',
    field: keyof Idea,
    value: string | number,
    shouldValidate?: boolean,
  ): void
}

export { CustomerAndContact, CustomerAndContactEmits }
