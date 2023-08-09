class Validation {
  checkEmail(email: string) {
    const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegExp.test(email) || 'Неверно введена почта'
  }

  checkPassword(password: string) {
    if (!password) {
      return 'Это обязательное поле'
    }
    if (password.length < 8) {
      return 'Пароль меньше 8 символов'
    }
    return true
  }
}

export default new Validation()