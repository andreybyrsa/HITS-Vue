interface Comment {
  id: number
  ideaId: number
  dateCreated: Date
  comment: string
  sender: string
  checkedBy: string[]
}

export default Comment
