import axios from 'axios'

import Success from '@Domain/ResponseMessage'
import Comment from '@Domain/Comment'

const COMMENT_URL = process.env.VUE_APP_COMMENT_API_URL || 'http://localhost:3000'

const postComment = async (
  comment: Comment,
  ideaId: string,
  token: string,
): Promise<Comment | Error> => {
  return await axios
    .post(`${COMMENT_URL}/send/${ideaId}`, comment, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка добавления комментария'
      return new Error(error)
    })
}

const deleteComment = async (
  commentId: string,
  ideaId: string,
  token: string,
): Promise<Success | Error> => {
  return await axios
    .delete(`${COMMENT_URL}/delete/${ideaId}/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response.data.error ?? 'Ошибка удаления комментария'
      return new Error(error)
    })
}

const checkComment = async (commentId: string, token: string) => {
  return await axios
    .put(`${COMMENT_URL}/check/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch<Error>(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка просмотра комментария'
      return new Error(error)
    })
}

const CommentService = {
  postComment,
  deleteComment,
  checkComment,
}

export default CommentService
