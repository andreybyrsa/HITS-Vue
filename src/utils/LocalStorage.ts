import { User } from '@Domain/User'

const LocalStorageUser = {
  getLocalStorageUser(): User {
    const localStorageUser = localStorage.getItem('user') ?? '{}'

    return JSON.parse(localStorageUser, (key: string, value: string) => {
      return key === 'lastActivity' ? new Date(value) : value
    })
  },

  setLocalStorageUser(user: User) {
    const localStorageUser: User = {
      ...user,
      lastActivity: new Date(),
    }

    localStorage.setItem('user', JSON.stringify(localStorageUser))

    return localStorageUser
  },
}

export default LocalStorageUser
