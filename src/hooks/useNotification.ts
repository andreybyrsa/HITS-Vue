import { useNotificationsStore } from '@Store'

export const useNotification = (title: string, message: string) => {
  useNotificationsStore().createSystemNotification(title, message)
}
