interface Notification {
  id: number
  title: string
  message: string
  isReaded: boolean
  // isShowed: boolean
  isFavourite: boolean
  createdAt?: string
}

export default Notification
