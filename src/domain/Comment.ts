interface Comment {
  id: string
  ideaId: string
  createdAt: string

  text: string
  senderEmail: string
  checkedBy: string[]
}

export default Comment
