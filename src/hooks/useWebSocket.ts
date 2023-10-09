import { Ref, ref } from 'vue'
import { RSocketClient, JsonSerializer, IdentitySerializer } from 'rsocket-core'
import RSocketWebsocketClient from 'rsocket-websocket-client'

async function useWebSocket<Type>(subscribeUrl: string, socketData?: Type) {
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

export default useWebSocket

// import RSocketWebSocketClient from 'rsocket-websocket-client'
// import {
//   BufferEncoders,
//   MESSAGE_RSOCKET_COMPOSITE_METADATA,
//   RSocketClient,
// } from 'rsocket-core'
// import { useState } from 'react'
// import {
//   APPLICATION_JSON,
//   encodeBearerAuthMetadata,
//   encodeCompositeMetadata,
//   encodeRoute,
//   MESSAGE_RSOCKET_AUTHENTICATION,
//   MESSAGE_RSOCKET_ROUTING,
// } from 'rsocket-core/build'
// import { Flowable } from 'rsocket-flowable/build'

// const wsUrl = 'ws://localhost:7000/ws'
// const randomJwt = 'JWT_TOKEN'

// function Test() {
//   const [client, setClient] = useState(null)
//   const [socket, setSocket] = useState(null)

//   if (client == null) {
//     const c = new RSocketClient({
//       setup: {
//         keepAlive: 120000,
//         lifetime: 180000,
//         dataMimeType: APPLICATION_JSON.string,
//         metadataMimeType: MESSAGE_RSOCKET_COMPOSITE_METADATA.string,
//       },
//       transport: new RSocketWebSocketClient(
//         {
//           url: wsUrl,
//           debug: true,
//         },
//         BufferEncoders,
//       ),
//     })
//     setClient(c)
//     c.connect().then(
//       (socket) => {
//         setSocket(socket)
//         socket
//           .requestChannel(
//             Flowable.just({
//               data: Buffer.from(
//                 JSON.stringify({ action: 'load', symbols: ['SPLK', 'CSCO'] }),
//               ),
//               metadata: encodeCompositeMetadata([
//                 [MESSAGE_RSOCKET_ROUTING, encodeRoute('iex')],
//                 [
//                   MESSAGE_RSOCKET_AUTHENTICATION,
//                   encodeBearerAuthMetadata(randomJwt),
//                 ],
//               ]),
//             }),
//           )
//           .subscribe({
//             onComplete: () => console.log('complete'),
//             onError: (error) => {
//               if (
//                 error &&
//                 error.source &&
//                 error.source.code === 513 &&
//                 error.source.message.indexOf('Access token expired') > -1
//               ) {
//               }
//               console.log(error)
//             },
//             onNext: (payload) => {
//               const json = payload.data.toString()
//               console.log(json)
//             },
//             onSubscribe: (subscription) => {
//               subscription.request(2147483647)
//             },
//           })
//         console.log('composite connection succeeded!')
//       },
//       (error) => {
//         console.log('composite initial connection failed', error)
//       },
//     )
//     console.log('connecting!')
//   }
//   if (socket != null && client != null) {
//     return <div>Connected - see log!</div>
//   } else {
//     return <div>Connecting!</div>
//   }
// }

// export default Test
