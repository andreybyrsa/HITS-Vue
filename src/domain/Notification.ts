interface Notification {
  id: string
  userId: string
  title: string
  message: string
  isShowed: boolean
  isReaded: boolean
  isFavourite: boolean
  createdAt: string
}

export default Notification
