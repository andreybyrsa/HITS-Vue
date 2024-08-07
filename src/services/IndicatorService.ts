import { Indicator, IndicatorCategory } from '@Domain/Quest'

import useUserStore from '@Store/user/userStore'

import defineAxios from '@Utils/defineAxios'
import getAbortedSignal from '@Utils/getAbortedSignal'
import { indicatorsMocks, indicatorCategories } from '@Utils/getMocks'
import handleAxiosError from '@Utils/handleAxiosError'

const indicatorAxios = defineAxios(indicatorsMocks)
const indicatorCategoriesAxios = defineAxios(indicatorCategories)

function formatIndicators(indicators: Indicator[]): Indicator[] {
  return indicators.slice(0, 19)
}

function formatIndicatorCategories(
  indicatorCategories: IndicatorCategory[],
): IndicatorCategory[] {
  return indicatorCategories.slice(0, 2)
}

// --- GET --- //
const getIndicators = async (token: string): Promise<Indicator[] | Error> => {
  return indicatorAxios
    .get<Indicator[] | Error>(
      `/api/v1/quest-service/indicator/all`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { formatter: formatIndicators },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки вопросов.'))
}

const getIndicatorCategories = async (
  token: string,
): Promise<IndicatorCategory[] | Error> => {
  return indicatorCategoriesAxios
    .get<IndicatorCategory[] | Error>(
      `/api/v1/quest-service/category/all`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      { formatter: formatIndicatorCategories },
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка загрузки категорий вопросов.'))
}

// --- POST --- //
const postIndicator = async (
  indicator: Indicator,
  token: string,
): Promise<Indicator | Error> => {
  return indicatorAxios
    .post(`/api/v1/quest-service/indicator/create`, indicator, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка создания вопроса.'))
}

const postIndicatorCategory = async (
  indicatorCategory: IndicatorCategory,
  token: string,
): Promise<IndicatorCategory | Error> => {
  return indicatorCategoriesAxios
    .post(`/api/v1/quest-service/category/create`, indicatorCategory, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка создания вопроса.'))
}

const deleteIndicator = async (
  id: string,
  token: string,
): Promise<Indicator | Error> => {
  return indicatorAxios
    .putNoRequestBody<Error | Indicator>(
      `/api/v1/quest-service/indicator/hide/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {},
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка удаления вопроса.'))
}

const deleteIndicatorCategory = async (
  idCategory: string,
  token: string,
): Promise<IndicatorCategory | Error> => {
  return indicatorCategoriesAxios
    .putNoRequestBody<Error | IndicatorCategory>(
      `/api/v1/quest-service/category/hide/${idCategory}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
      },
      {},
    )
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка удаления категории.'))
}

const IndicatorService = {
  getIndicators,
  getIndicatorCategories,
  postIndicator,
  postIndicatorCategory,
  deleteIndicator,
  deleteIndicatorCategory,
}

export default IndicatorService
