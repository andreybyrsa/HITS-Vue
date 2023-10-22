interface Comment {
  id: number
  ideaId: number
  createdAt: string

  text: string
  senderEmail: string
  checkedBy: number[]
}

export default Comment
