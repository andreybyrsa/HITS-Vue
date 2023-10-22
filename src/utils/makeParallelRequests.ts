import { Ref, ref, watch } from 'vue'

interface RequestResult<ResultType> {
  id: number
  status: 'fulfilled' | 'rejected'
  value: ResultType
}

async function makeParallelRequests<PromiseType>(
  requests: (() => Promise<PromiseType>)[],
): Promise<RequestResult<PromiseType>[]> {
  const requestsResults = ref<RequestResult<PromiseType>[]>([]) as Ref<
    RequestResult<PromiseType>[]
  >

  const sendRequest = async (request: () => Promise<PromiseType>, id: number) => {
    const response = await request()

    if (response instanceof Error) {
      requestsResults.value.push({ id, status: 'rejected', value: response })
    } else {
      requestsResults.value.push({ id, status: 'fulfilled', value: response })
    }
  }

  return new Promise((resolve) => {
    watch(
      requestsResults,
      () => {
        if (requestsResults.value.length === requests.length) {
          resolve(requestsResults.value)
        }
      },
      { deep: true },
    )

    requests.forEach((request, index) => sendRequest(request, index))
  })
}

export { makeParallelRequests, RequestResult }
