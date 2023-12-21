type ChangeStatusCode = 'WRONG_CODE' | 'CHANGE_FAILED'

interface GetChangeStatusCode {
  translatedStatus: {
    [key in ChangeStatusCode]: string
  }
}

function getChangeStatusCode(): GetChangeStatusCode {
  return {
    translatedStatus: {
      WRONG_CODE: 'Неверный код',
      CHANGE_FAILED: 'Ошибка смены пароля',
    },
  }
}

export { getChangeStatusCode, ChangeStatusCode }
