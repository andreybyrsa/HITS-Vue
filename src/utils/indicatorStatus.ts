import { IndicatorType } from '@Domain/Quest'

const indicatorTypes: IndicatorType[] = [
  'TEAM',
  'INITIATOR',
  'TEAM-MEMBER',
  'TEAMLEAD',
]

const indicatorTranslatedTypes = [
  'Оценка команды',
  'Оценка инициатора',
  'Оценка участников команды',
  'Оценка команды',
]

export const getIndicatorTranslatedStatus = (
  indicatorType: IndicatorType,
): string => {
  if (indicatorType == indicatorTypes[0]) return indicatorTranslatedTypes[0]
  if (indicatorType == indicatorTypes[1]) return indicatorTranslatedTypes[1]
  if (indicatorType == indicatorTypes[2]) return indicatorTranslatedTypes[2]
  return indicatorTranslatedTypes[3]
}

export const getIndicatorStatus = (
  indicatorTranslatedType: string,
): IndicatorType => {
  if (indicatorTranslatedType == indicatorTranslatedTypes[0])
    return indicatorTypes[0]
  if (indicatorTranslatedType == indicatorTranslatedTypes[1])
    return indicatorTypes[1]
  if (indicatorTranslatedType == indicatorTranslatedTypes[2])
    return indicatorTypes[2]
  return indicatorTypes[3]
}

export const findStatusesByTranslatedStatus = (
  translatedStatus: string,
): string[] => {
  if (!translatedStatus) return []
  return indicatorTranslatedTypes
    .filter((indicatorTranslatedType) =>
      indicatorTranslatedType.toLowerCase().includes(translatedStatus.toLowerCase()),
    )
    .map((value) => getIndicatorStatus(value))
}
