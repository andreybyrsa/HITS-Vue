import { Indicator, IndicatorCategory } from '@Domain/Quest'
import { QUEST_SERVICE_URL } from '@Main'

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
      `${QUEST_SERVICE_URL}/indicator/all`,
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
      `${QUEST_SERVICE_URL}/category/all`,
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
    .post(`${QUEST_SERVICE_URL}/indicator/create`, indicator, {
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
    .post(`${QUEST_SERVICE_URL}/category/create`, indicatorCategory, {
      headers: { Authorization: `Bearer ${token}` },
      signal: getAbortedSignal(useUserStore().checkIsExpiredToken),
    })
    .then((response) => response.data)
    .catch((error) => handleAxiosError(error, 'Ошибка создания вопроса.'))
}

const IndicatorService = {
  getIndicators,
  getIndicatorCategories,
  postIndicator,
  postIndicatorCategory,
}

export default IndicatorService
