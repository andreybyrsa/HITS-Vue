import Comment from '@Domain/Comment'

interface CommentProps {
  className?: string

  comment: Comment
}

interface CommentPlaceholderProps {
  className?: string
}

interface CommentEmits {
  (event: 'delete-comment'): void
}

export { CommentProps, CommentPlaceholderProps, CommentEmits }
