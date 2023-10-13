import Comment from '@Domain/Comment'
import Success from '@Domain/ResponseMessage'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'

const commentAxios = defineAxios(getMocks().comments)

const fetchComments = async (
  ideaId: string,
  token: string,
): Promise<Comment[] | Error> => {
  return await commentAxios
    .get(`/comment/all/${ideaId}`, {
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
  return await commentAxios
    .post(`/comment/send/${ideaId}`, comment, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка добавления комментария'
      return new Error(error)
    })
}

const deleteComment = async (
  id: string,
  token: string,
): Promise<Success | Error> => {
  return await commentAxios
    .delete(
      `/comment/delete/${id}`,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка удаления комментария'
      return new Error(error)
    })
}

const checkComment = async (id: string, token: string) => {
  return await commentAxios
    .putNoRequestBody(
      `/comment/check/${id}`,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { id }, requestData: { checkedBy: ['admin@mail.com'] } },
    )
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
