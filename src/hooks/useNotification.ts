import { ref, reactive } from 'vue'

interface NotificationOptions {
  type?: 'success' | 'error'
  message?: string
}

function useNotification() {
  const notificationOptions = reactive<NotificationOptions>({})
  const isOpenedNotification = ref(false)

  const handleOpenNotification = (type?: 'success' | 'error', message?: string) => {
    notificationOptions.type = type
    notificationOptions.message = message
    isOpenedNotification.value = true
  }

  const handleCloseNotification = () => {
    isOpenedNotification.value = false
  }

  return {
    notificationOptions,
    isOpenedNotification,
    handleOpenNotification,
    handleCloseNotification,
  }
}

export default useNotification
