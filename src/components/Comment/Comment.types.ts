import Comment from '@Domain/Comment'

interface CommentProps {
  className?: string

  comment: Comment
}

interface CommentEmits {
  (event: 'delete-comment'): void
}

export { CommentProps, CommentEmits }
