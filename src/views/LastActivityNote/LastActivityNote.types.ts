export interface Change {
  name: string
  date: Date
  who: string
  number: number
  doing: string
}

export interface LastActivityNoteProps {
  changes: Change[]
}
