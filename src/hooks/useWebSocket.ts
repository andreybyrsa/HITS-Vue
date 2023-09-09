import { RSocketClient, JsonSerializer, IdentitySerializer } from 'rsocket-core'
import RSocketWebsocketClient from 'rsocket-websocket-client'

async function useWebSocket() {
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

  client.connect().subscribe({
    onComplete: (socket) => {
      socket
        .requestStream({
          data: '123',
          metadata:
            String.fromCharCode('comment.64fc314dcee2a13c1c3e1fa2 '.length) +
            'comment.64fc314dcee2a13c1c3e1fa2 ',
        })
        .subscribe({
          onComplete: () => console.log('1'),
          onError: (error) => console.log(error.message),
          onNext: (payload) => console.log(payload.data),
          onSubscribe: (s) => s.request(21321313),
        })
    },
    onError: (error) => console.log(error),
  })
}

export default useWebSocket
