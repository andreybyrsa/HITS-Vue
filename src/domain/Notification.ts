interface Notification {
  id: number
  userId: number
  title: string
  message: string
  isShowed: boolean
  isReaded: boolean
  isFavourite: boolean
  createdAt: string
}

export default Notification
