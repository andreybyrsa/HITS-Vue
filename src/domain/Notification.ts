interface Notification {
  id: number
  title: string
  message: string
  readed: boolean
  isFavorite?: boolean
  time?: string
  data?: string
  type?: 'SYSTEM' | 'USER'
}

export default Notification
