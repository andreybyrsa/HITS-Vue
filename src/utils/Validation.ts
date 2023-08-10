class Validation {
  checkEmail(email: string) {
    const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegExp.test(email) || 'Неверно введена почта'
  }

  checkName(name: string) {
    const nameRegExp = /^[а-я ,.'-]+$/i
    return nameRegExp.test(name)
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

const ValidationController = new Validation()
type ValidationKeys = keyof typeof ValidationController
type ValidationMethods = (typeof ValidationController)[ValidationKeys]

export default new Validation()
export type { ValidationMethods }
