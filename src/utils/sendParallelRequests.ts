import { Ref, ref, watch } from 'vue'

import useNotificationsStore from '@Store/notifications/notificationsStore'

interface RequestConfig {
  request: () => Promise<unknown>
  refValue: Ref<unknown>
  statement?: boolean
  onSuccessFunc?: (response: unknown) => void
  onErrorFunc?: (error: Error) => void
}

interface ResolvedRequest extends RequestConfig {
  status: 'fulfilled' | 'rejected'
  value: unknown
}

async function sendParallelRequests(parallelRequests: RequestConfig[]) {
  const handledRequests = ref(0)
  const resolvedRequests: ResolvedRequest[] = []

  const sendRequest = async (requestConfig: RequestConfig) => {
    const { request, statement } = requestConfig
    const canSendRequest = statement !== undefined ? statement : true

    if (canSendRequest) {
      const response = await request()

      if (response instanceof Error) {
        resolvedRequests.push({
          ...requestConfig,
          status: 'rejected',
          value: response,
        })
      } else {
        resolvedRequests.push({
          ...requestConfig,
          status: 'fulfilled',
          value: response,
        })
      }
    }

    handledRequests.value += 1
  }

  const handleResolvedRequests = (resolve: (value: unknown) => void) => {
    if (handledRequests.value === parallelRequests.length) {
      resolvedRequests.forEach((requestResult) => {
        const { status, value, refValue, onSuccessFunc, onErrorFunc } = requestResult

        if (status === 'fulfilled') {
          refValue.value = value

          if (onSuccessFunc) {
            onSuccessFunc(value)
          }
        } else if (value instanceof Error && onErrorFunc) {
          onErrorFunc(value)
        }
      })

      resolve(resolvedRequests)
    }
  }

  return new Promise((resolve) => {
    watch(handledRequests, () => handleResolvedRequests(resolve))

    parallelRequests.forEach((requestConfig) => sendRequest(requestConfig))
  })
}

function openErrorNotification(error: Error) {
  const notificationsStore = useNotificationsStore()

  notificationsStore.createSystemNotification('Система', error.message)
}

export { sendParallelRequests, RequestConfig, openErrorNotification }
