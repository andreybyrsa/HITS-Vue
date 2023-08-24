interface Comment {
  id: number
  dateCreated: Date
  comment: string
  sender: string
  checkedBy: string[]
}

export default Comment
