export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  link: string | null
  isShowed: boolean
  isReaded: boolean
  isFavourite: boolean
  createdAt: string
}
