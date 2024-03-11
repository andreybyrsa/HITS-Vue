import { api } from '@Api'
import { User, UpdateUserPassword, NewEmailForm, Success } from '@Domain'
import { TryCatch, defineAxios, usersEmailsMocks, usersMocks } from '@Utils'

const usersDefineApi = defineAxios(usersMocks)
const usersEmailsDefineApi = defineAxios(usersEmailsMocks)

export class ManageUsersService {
  @TryCatch
  static async getUsers(): Promise<User[] | Error> {
    const response = await usersDefineApi.get('/profile/get/users')
    return response.data
  }

  @TryCatch
  static async getUsersEmails(): Promise<string[] | Error> {
    const response = await usersEmailsDefineApi.get('/profile/get/emails')
    return response.data
  }

  @TryCatch
  static async updateUserInfo(newUserData: User): Promise<User | Error> {
    const response = await usersDefineApi.put(
      '/profile/change/info',
      newUserData,
      {},
      { params: { id: newUserData.id } },
    )
    return response.data
  }

  @TryCatch
  static async updateUserPassword(
    newPasswordData: UpdateUserPassword,
  ): Promise<Success | Error> {
    const response = await api.put('/profile/change/password', newPasswordData)
    return response.data
  }

  @TryCatch
  static async updateUserEmail(
    newEmailData: NewEmailForm,
  ): Promise<Success | Error> {
    const response = await api.put('/profile/change/email', newEmailData, {})
    return response.data
  }

  @TryCatch
  static async deleteUser(id: string): Promise<Success | Error> {
    const response = await usersDefineApi.delete(
      `/profile/delete/user/${id}`,
      {},
      { params: { id } },
    )
    return response.data
  }
}
