import { api } from '@Api'
import { User, LoginUser, RegisterUser } from '@Domain'
import { TryCatch } from '@Utils'

export class AuthService {
  @TryCatch
  static async login(user: LoginUser): Promise<User | Error> {
    return api.post(`/auth/login`, user).then(() => {
      return {
        id: 'ffc1b25e-8a65-4cb2-8808-6eba443acec8',
        token: '11110',
        firstName: 'Кирилл',
        lastName: 'Власов',
        telephone: '1111111111',
        studyGroup: 'AAAA-22-1',
        ...user,
        roles: [
          'ADMIN',
          'EXPERT',
          'INITIATOR',
          'MEMBER',
          'TEAM_OWNER',
          'PROJECT_OFFICE',
        ],
      }
    })
  }

  @TryCatch
  static async register(user: RegisterUser): Promise<User | Error> {
    const response = await api.post('/auth/register', user)
    return response.data
  }
}
