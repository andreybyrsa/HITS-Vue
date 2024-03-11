import { Success, UsersGroup } from '@Domain'
import { TryCatch, defineAxios, usersGroupsMocks } from '@Utils'

const defineApi = defineAxios(usersGroupsMocks)

export class UsersGroupsService {
  @TryCatch
  static async getUsersGroups(): Promise<UsersGroup[] | Error> {
    const response = await defineApi.get('/group/all')
    return response.data
  }

  @TryCatch
  static async getUsersGroup(id: string): Promise<UsersGroup | Error> {
    const response = await defineApi.get(`/group/${id}`, {}, { params: { id } })
    return response.data
  }

  @TryCatch
  static async createUsersGroup(usersData: UsersGroup): Promise<UsersGroup | Error> {
    const response = await defineApi.post('/group/create', usersData)
    return response.data
  }

  @TryCatch
  static async updateUsersGroup(
    usersGroup: UsersGroup,

    id: string,
  ): Promise<UsersGroup | Error> {
    const response = await defineApi.put(
      `/group/update/${id}`,
      usersGroup,
      {},
      { params: { id } },
    )
    return response.data
  }

  @TryCatch
  static async deleteUsersGroup(id: string): Promise<Success | Error> {
    const response = await defineApi.delete(
      `/group/delete/${id}`,
      {},
      { params: { id } },
    )
    return response.data
  }
}
