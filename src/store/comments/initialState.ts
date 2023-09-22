import Comment from '@Domain/Comment'

interface InitialState {
  comments: Comment[]
  rsocketIsConnected: boolean
  closeRsocket: () => void
  commentsError: string
}

export default InitialState
