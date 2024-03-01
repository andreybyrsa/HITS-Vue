import Comment from '@Domain/Comment'
import Success from '@Domain/ResponseMessage'
import defineAxios from '@Utils/defineAxios'
import { commentsMocks } from '@Utils/getMocks'

const defineApi = defineAxios(commentsMocks)

const filterById = (id: string, comments: Comment[]) => {
  return comments.filter((comment) => comment.ideaId === id)
}

const get = async (id: string): Promise<Comment[] | Error> => {
  const response = await defineApi.get<Comment[]>(
    `/comment/all/${id}`,
    {},
    { formatter: (comments) => filterById(id, comments) },
  )
  return response.data
}

const create = async (comment: Comment): Promise<Comment | Error> => {
  const response = await defineApi.post('/comment/send', comment)
  return response.data
}

const remove = async (id: string): Promise<Success | Error> => {
  const response = await defineApi.delete(
    `/comment/delete/${id}`,
    {},
    { params: { id } },
  )
  return response.data
}

const check = async (id: string, userId: string): Promise<void | Error> => {
  const response = await defineApi.putNoRequestBody<void>(
    `/comment/check/${id}`,
    {},
    { params: { id }, requestData: { checkedBy: [userId] } },
  )
  return response.data
}

export const CommentService = {
  get,
  create,
  remove,
  check,
}
