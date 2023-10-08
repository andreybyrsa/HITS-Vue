interface Change {
  name: string
  date: Date
  who: string
  number: number
  doing: string
}

interface LastActivityNoteProps {
  changes: Change[]
}

export { LastActivityNoteProps, Change }
