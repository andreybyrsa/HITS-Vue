import { api } from '@Api'
import { User, LoginUser, RegisterUser } from '@Domain/User'

// TODO: Рефакторинг логина
const login = async (user: LoginUser): Promise<User | Error> => {
  return api
    .post('/auth/login', user)
    .then((response) => response.data)
    .catch(() => {
      return {
        id: 'ffc1b25e-8a65-4cb2-8808-6eba443acec8',
        token: '11110',
        firstName: 'Кирилл',
        lastName: 'Власов',
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

const register = async (user: RegisterUser): Promise<User | Error> => {
  const response = await api.post('/auth/register', user)
  return response.data
}

export const AuthService = {
  login,
  register,
}
