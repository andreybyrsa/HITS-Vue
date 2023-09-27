import Notification from '@Domain/Notification'

interface InitialState {
  newNotifications: Notification[]
  systemNotifications: Notification[]
  notifications: Notification[]
}

export default InitialState
