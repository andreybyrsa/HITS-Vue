import { UserMetadata } from '@Domain/User'

class LocalStorageUser {
  private LOCAL_STORAGE_KEY = 'metadata'

  public setMetadata(metadata: UserMetadata): void {
    const updateLocalStorageMetadata = (value: UserMetadata) =>
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify(value))

    updateLocalStorageMetadata(metadata)
  }

  public getMetadata(): UserMetadata | null {
    const stringifiedUser = localStorage.getItem(this.LOCAL_STORAGE_KEY) ?? '{}'
    const jsonParsedUser = JSON.parse(stringifiedUser) as UserMetadata
    return jsonParsedUser
  }

  public removeMetadata() {
    localStorage.removeItem(this.LOCAL_STORAGE_KEY)
  }
}

export default new LocalStorageUser()
