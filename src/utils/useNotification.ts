import { ref, reactive } from 'vue'

import ResponseMessage from '@Domain/ResponseMessage'

function useNotification() {
  const responseMessage = reactive<ResponseMessage>({})
  const isOpenedNotification = ref(false)

  const handleOpenNotification = (
    type?: 'success' | 'error',
    message?: string,
  ) => {
    responseMessage.type = type
    responseMessage.message = message
    isOpenedNotification.value = true
  }

  const handleCloseNotification = () => {
    isOpenedNotification.value = false
  }

  return {
    responseMessage,
    isOpenedNotification,
    handleOpenNotification,
    handleCloseNotification,
  }
}

export default useNotification
