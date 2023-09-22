interface Comment {
  id: string
  ideaId: string
  createdAt: Date

  comment: string
  sender: string
  checkedBy: string[]
}

export default Comment
