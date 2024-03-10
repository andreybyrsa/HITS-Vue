import { Ref, ref } from 'vue'
import { RSocketClient, JsonSerializer, IdentitySerializer } from 'rsocket-core'
import RSocketWebsocketClient from 'rsocket-websocket-client'

export const useWebSocket = async <Type>(
  subscribeUrl: string,
  socketData?: Type,
) => {
  const data = ref<Type>() as Ref<Type>
  const isConnected = ref(false)

  const client = new RSocketClient({
    serializers: {
      data: JsonSerializer,
      metadata: IdentitySerializer,
    },
    setup: {
      keepAlive: 60000,
      lifetime: 180000,
      dataMimeType: 'application/json',
      metadataMimeType: 'message/x.rsocket.routing.v0',
    },
    transport: new RSocketWebsocketClient({
      url: 'ws://localhost:3000/rs',
    }),
  })

  function closeConnection() {
    client.close()
  }

  await new Promise((resolve, reject) => {
    client.connect().then(
      (socket) => {
        resolve((isConnected.value = true))

        socket
          .requestStream({
            metadata: String.fromCharCode(subscribeUrl.length) + subscribeUrl,
          })
          .subscribe({
            onError: (error) => reject(error),
            onNext: (payload) => {
              if (socketData instanceof Array) {
                socketData.push(payload.data)
              } else {
                socketData = payload.data
              }

              if (data.value instanceof Array) {
                data.value.push(payload.data)
              } else {
                data.value = payload.data
              }
            },
            onSubscribe: (subscirbe) => subscirbe.request(1000),
          })
      },
      (error) => reject(error),
    )
  })

  return { data, isConnected, closeConnection }
}
