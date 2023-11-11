class Validation {
  checkIsEmptyValue<DataType>(data: DataType) {
    const isNonNullable = <ValueType>(value: ValueType) =>
      value !== undefined && value !== null

    if (data instanceof Array) {
      return data.length > 0 && data.every((value) => isNonNullable(value))
    }

    if (typeof data === 'string') {
      return data.length > 0
    }

    return isNonNullable(data) && !isNaN(Number(data))
  }

  checkEmail(email: string) {
    const emailRegExp = /[a-zA-Z_.-{0,9}-]+@[a-zA-Z_.-{0,9}-]+\.[a-zA-Z]{2,10}$/
    return emailRegExp.test(email)
  }

  checkName(name: string) {
    const nameRegExp = /^[а-я a-z ,.'-]+$/i
    return name && nameRegExp.test(name) && name.length > 0
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
