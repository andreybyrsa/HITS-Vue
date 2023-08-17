import axios from 'axios'

import ResponseMessage from '@Domain/ResponseMessage'

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
  commentID: number,
  token: string,
): Promise<ResponseMessage> => {
  return await axios
    .delete(`${COMMENT_URL}/delete/${commentID}`, {
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
  comment: Comment,
  token: string,
): Promise<ResponseMessage> => {
  return await axios
    .put(`${COMMENT_URL}/check`, comment, {
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
