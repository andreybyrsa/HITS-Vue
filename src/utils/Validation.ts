class Validation {
  checkEmail(email: string) {
    const emailRegExp = /[a-zA-Z_.-{0,9}]+@[a-zA-Z_]+\.[a-zA-Z]{2,10}$/
    return emailRegExp.test(email)
  }

  checkName(name: string) {
    const nameRegExp = /^[а-я a-z ,.'-]+$/i
    return nameRegExp.test(name) && name?.length > 0
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
