import { User } from '@Domain'

export interface Comment {
  id: string
  ideaId: string
  createdAt: string

  text: string
  sender: User
  checkedBy: string[]
}
