import { Notification } from '@Domain/Notification'

interface InitialState {
  currentNotification: Notification | null
  notifications: Notification[]
}

export default InitialState
