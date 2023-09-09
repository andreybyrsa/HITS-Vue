import axios from 'axios'

const COMMENT_URL = process.env.VUE_APP_COMMENT_API_URL || 'http://localhost:3000'

// const fetchIdeaComments = async (
//   ideaId: number,
//   token: string,
// ): Promise<{ comments: Comment[] } | Error> => {
//   return await axios
//     .get(`${COMMENT_URL}/get-idea-comments/${ideaId}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     })
//     .then((response) => response.data)
//     .catch(({ response }) => {
//       const error = response?.data?.error ?? 'Ошибка получения комментариев'
//       return new Error(error)
//     })
// }

const addComment = async (
  comment: string,
  ideaId: number,
  token: string,
): Promise<undefined | Error> => {
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
  ideaId: number,
  commentId: number,
  token: string,
): Promise<undefined | Error> => {
  return await axios
    .delete(`${COMMENT_URL}/delete/${ideaId}/${commentId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка удаления комментария'
      return new Error(error)
    })
}

const checkComment = async (
  commentId: number,
  token: string,
): Promise<undefined | Error> => {
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
  // fetchIdeaComments,
  addComment,
  deleteComment,
  checkComment,
}

export default CommentService
