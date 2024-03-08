import { Comment, Success } from '@Domain'
import { defineAxios, commentsMocks, TryCatch } from '@Utils'

const defineApi = defineAxios(commentsMocks)

const filterById = (id: string, comments: Comment[]) => {
  return comments.filter((comment) => comment.ideaId === id)
}

export class CommentService {
  @TryCatch
  static async get(id: string): Promise<Comment[] | Error> {
    const response = await defineApi.get<Comment[]>(
      `/comment/all/${id}`,
      {},
      { formatter: (comments) => filterById(id, comments) },
    )
    return response.data
  }

  @TryCatch
  static async create(comment: Comment): Promise<Comment | Error> {
    const response = await defineApi.post('/comment/send', comment)
    return response.data
  }

  @TryCatch
  static async remove(id: string): Promise<Success | Error> {
    const response = await defineApi.delete(
      `/comment/delete/${id}`,
      {},
      { params: { id } },
    )
    return response.data
  }

  @TryCatch
  static async check(id: string, userId: string): Promise<void | Error> {
    const response = await defineApi.putNoRequestBody<void>(
      `/comment/check/${id}`,
      {},
      { params: { id }, requestData: { checkedBy: [userId] } },
    )
    return response.data
  }
}
