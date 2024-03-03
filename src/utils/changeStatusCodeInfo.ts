export type ChangeStatusCode = 'WRONG_CODE' | 'CHANGE_FAILED'

interface GetChangeStatusCode {
  translatedStatus: {
    [key in ChangeStatusCode]: string
  }
}

export const getChangeStatusCode = (): GetChangeStatusCode => {
  return {
    translatedStatus: {
      WRONG_CODE: 'Неверный код',
      CHANGE_FAILED: 'Ошибка смены пароля',
    },
  }
}
