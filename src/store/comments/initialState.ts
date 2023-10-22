import Comment from '@Domain/Comment'

interface InitialState {
  comments: Comment[] | null
  rsocketIsConnected: boolean
  closeRsocket: () => void
}

export default InitialState
