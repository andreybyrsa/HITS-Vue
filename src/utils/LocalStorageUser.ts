import { User } from '@Domain/User'

class LocalStorageUser {
  getLocalStorageUser(): User | null {
    const localStorageUser = localStorage.getItem('user') ?? '{}'

    return JSON.parse(localStorageUser, (key: string, value: string) => {
      return key === 'lastLogin' ? new Date(value) : value
    })
  }

  setLocalStorageUser(user: User) {
    const localStorageUser: User = {
      ...user,
      lastLogin: new Date(),
    }

    localStorage.setItem('user', JSON.stringify(localStorageUser))

    return localStorageUser
  }

  removeLocalStorageUser() {
    localStorage.removeItem('user')
  }
}

export default new LocalStorageUser()
