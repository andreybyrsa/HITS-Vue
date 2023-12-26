import { User } from '@Domain/User'

interface Comment {
  id: string
  ideaId: string
  createdAt: string

  text: string
  sender: User
  checkedBy: string[]
}

export default Comment
