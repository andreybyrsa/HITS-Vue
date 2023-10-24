import Comment from '@Domain/Comment'
import Success from '@Domain/ResponseMessage'

import defineAxios from '@Utils/defineAxios'
import getMocks from '@Utils/getMocks'

const commentAxios = defineAxios(getMocks().comments)

function filterCommentsById(ideaId: number, comments: Comment[]) {
  return comments.filter((comment) => comment.ideaId === ideaId)
}

const getComments = async (
  ideaId: number,
  token: string,
): Promise<Comment[] | Error> => {
  return await commentAxios
    .get<Comment[]>(
      `/comment/all/${ideaId}`,
      { headers: { Authorization: `Bearer ${token}` } },
      { formatter: (comments) => filterCommentsById(ideaId, comments) },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка получения комментариев'
      return new Error(error)
    })
}

const createComment = async (
  comment: Comment,
  token: string,
): Promise<Comment | Error> => {
  return await commentAxios
    .post('/comment/send', comment, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка добавления комментария'
      return new Error(error)
    })
}

const deleteComment = async (
  id: number,
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

const checkComment = async (
  userId: number,
  id: number,
  token: string,
): Promise<void | Error> => {
  return await commentAxios
    .putNoRequestBody<void>(
      `/comment/check/${id}`,
      { headers: { Authorization: `Bearer ${token}` } },
      { params: { id }, requestData: { checkedBy: [userId] } },
    )
    .then((response) => response.data)
    .catch(({ response }) => {
      const error = response?.data?.error ?? 'Ошибка просмотра комментария'
      return new Error(error)
    })
}

const CommentService = {
  getComments,
  createComment,
  deleteComment,
  checkComment,
}

export default CommentService
