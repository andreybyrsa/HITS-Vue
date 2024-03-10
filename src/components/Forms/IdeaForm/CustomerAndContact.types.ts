import { Idea } from '@Domain'

export interface CustomerAndContact {
  idea: Idea
}

export interface CustomerAndContactEmits {
  (
    event: 'set-value',
    field: keyof Idea,
    value: string | number,
    shouldValidate?: boolean,
  ): void
}
