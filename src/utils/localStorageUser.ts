import { User } from '@Domain'

class LocalStorageUser {
  private LOCAL_STORAGE_KEY = 'user'

  public getLocalStorageUser(): User | null {
    const stringifiedUser = localStorage.getItem(this.LOCAL_STORAGE_KEY) ?? '{}'
    const jsonParsedUser = JSON.parse(stringifiedUser) as User

    if (jsonParsedUser.token) {
      return JSON.parse(stringifiedUser, (key: string, value: string) => {
        return key === 'lastLogin' ? new Date(value) : value
      })
    }

    return null
  }

  public setLocalStorageUser(user: User) {
    const localStorageUser = this.getLocalStorageUser()

    const updateLocalStorageUser = (value: User) =>
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(value))

    if (localStorageUser?.token) {
      const currentLocalStorageUser: User = {
        ...localStorageUser,
        ...user,
      }

      updateLocalStorageUser(currentLocalStorageUser)

      localStorage.setItem(
        this.LOCAL_STORAGE_KEY,
        JSON.stringify(currentLocalStorageUser),
      )
    } else {
      const currentLocalStorageUser: User = {
        ...user,
        lastLogin: new Date(),
      }

      updateLocalStorageUser(currentLocalStorageUser)
    }
  }

  public removeLocalStorageUser() {
    localStorage.removeItem('user')
  }
}

export const localStorageUser = new LocalStorageUser()
