class Validation {
  checkEmail(email: string) {
    const emailRegExp = /^\w+@[a-zA-Z_]+\.[a-zA-Z]{2,10}$/
    return emailRegExp.test(email)
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
