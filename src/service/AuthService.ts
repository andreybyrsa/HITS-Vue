import { api } from '@Api'
import { User, LoginUser, RegisterUser } from '@Domain'
import { TryCatch } from '@Utils'

export class AuthService {
  @TryCatch
  static async login(user: LoginUser): Promise<User | Error> {
    const response = await api.post('/auth/login', user)
    return response.data
  }

  @TryCatch
  static async register(user: RegisterUser): Promise<User | Error> {
    const response = await api.post('/auth/register', user)
    return response.data
  }
}
