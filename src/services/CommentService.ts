import Comment from '@Domain/Comment'
import Success from '@Domain/ResponseMessage'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import { commentsMocks } from '@Utils/getMocks'
import handleAxiosError from '@Utils/handleAxiosError'

const commentAxios = defineAxios(commentsMocks)

function filterCommentsById(ideaId: string, comments: Comment[]) {
  return comments.filter((comment) => comment.ideaId === ideaId)
}

const getComments = async (
  ideaId: string,
  token: string,
): Promise<Comment[] | Error> => {
  return commentAxios
    .get<Comment[]>(
      `/comment/all/${ideaId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { formatter: (comments) => filterCommentsById(ideaId, comments) },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка получения комментариев'))
}

const createComment = async (
  comment: Comment,
  token: string,
): Promise<Comment | Error> => {
  return commentAxios
    .post('/comment/send', comment, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка добавления комментария'))
}

const checkComment = async (
  id: string,
  userId: string,
  token: string,
): Promise<void | Error> => {
  return commentAxios
    .putNoRequestBody<void>(
      `/comment/check/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id }, requestData: { checkedBy: [userId] } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка просмотра комментария'))
}

const deleteComment = async (
  id: string,
  token: string,
): Promise<Success | Error> => {
  return commentAxios
    .delete(
      `/comment/delete/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { params: { id } },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка удаления комментария'))
}

const CommentService = {
  getComments,

  createComment,

  checkComment,

  deleteComment,
}

export default CommentService
