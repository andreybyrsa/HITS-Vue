import axios from 'axios'

import ResponseMessage from '@Domain/ResponseMessage'
import Comment from '@Domain/Comment'

const COMMENT_URL =
  process.env.VUE_APP_COMMENT_API_URL || 'http://localhost:3000'

const addComment = async (
  comment: Comment,
  ideaID: number,
  token: string,
): Promise<Comment & ResponseMessage> => {
  return await axios
    .post(`${COMMENT_URL}/add/${ideaID}`, comment, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response
        ? response.data.error
        : 'Ошибка добавления комментария'
      return { error }
    })
}

const deleteComment = async (
  ideaID: number,
  commentID: number,
  token: string,
): Promise<ResponseMessage> => {
  return await axios
    .delete(`${COMMENT_URL}/delete/${ideaID}/${commentID}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response
        ? response.data.error
        : 'Ошибка удаления комментария'
      return { error }
    })
}

const checkComment = async (
  ideaID: number,
  comment: Comment,
  token: string,
): Promise<ResponseMessage> => {
  return await axios
    .put(`${COMMENT_URL}/check/${ideaID}`, comment, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response
        ? response.data.error
        : 'Ошибка просмотра комментария'
      return { error }
    })
}

const CommentService = {
  addComment,
  deleteComment,
  checkComment,
}

export default CommentService
