class LocalStorageTelegramTag {
  private LOCAL_STORAGE_KEY = 'telegramTag'

  public get() {
    return localStorage.getItem(this.LOCAL_STORAGE_KEY)
  }

  public set(value: string) {
    localStorage.setItem(this.LOCAL_STORAGE_KEY, value)
  }

  public removeLocalStorageUser() {
    localStorage.removeItem(this.LOCAL_STORAGE_KEY)
  }
}

export default new LocalStorageTelegramTag()
