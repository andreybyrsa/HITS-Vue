import axios from 'axios'

import Comment from '@Domain/Comment'

const COMMENT_URL = 'http://localhost:3000/api/v1/comment'

const fetchComments = async (
  ideaId: string,
  token: string,
): Promise<Comment[] | Error> => {
  return await axios(`${COMMENT_URL}/all/${ideaId}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения комментариев'
      return new Error(error)
    })
}

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
  token: string,
): Promise<undefined | Error> => {
  return await axios
    .delete(`${COMMENT_URL}/delete/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка удаления комментария'
      return new Error(error)
    })
}

const checkComment = async (commentId: string, token: string) => {
  return await axios
    .put(`${COMMENT_URL}/check/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка просмотра комментария'
      return new Error(error)
    })
}

const CommentService = {
  fetchComments,
  postComment,
  deleteComment,
  checkComment,
}

export default CommentService
