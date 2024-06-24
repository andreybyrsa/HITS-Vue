import { OptionType } from '@Components/Inputs/Select/Select.types'
import { IndicatorType, IndicatorRoleType } from '@Domain/Quest'

interface GetIndicatorFieldsType {
  indicatorTypes: IndicatorType[]
  indicatorTranslatedTypes: {
    [key in IndicatorType]: string
  }

  indicatorRoles: IndicatorRoleType[]
  indicatorTranslatedRoles: {
    [key in IndicatorRoleType]: string
  }
}

export const getIndicatorFieldsInfo = (): GetIndicatorFieldsType => {
  return {
    indicatorTypes: ['TEAM', 'INITIATOR', 'MEMBER', 'TEAM_LEADER', 'TEACHER'],
    indicatorTranslatedTypes: {
      TEAM: 'Оценка команды',
      INITIATOR: 'Оценка инициатора',
      MEMBER: 'Оценка участников команды',
      TEAM_LEADER: 'Оценка тимлида',
      TEACHER: 'Оценка преподавателя',
    },
    indicatorRoles: ['INITIATOR', 'MEMBER', 'TEACHER', 'TEAM_LEADER'],
    indicatorTranslatedRoles: {
      INITIATOR: 'Инициаторы',
      MEMBER: 'Студенты',
      TEACHER: 'Преподаватели',
      TEAM_LEADER: 'Лидеры команд',
    },
  }
}

export const indicatorTypeSelectOptions: OptionType[] =
  getIndicatorFieldsInfo().indicatorTypes.map((type) => {
    return {
      label: getIndicatorFieldsInfo().indicatorTranslatedTypes[type],
      value: type,
    }
  })

export const indicatorRoleSelectOptions: OptionType[] =
  getIndicatorFieldsInfo().indicatorRoles.map((role) => {
    return {
      label: getIndicatorFieldsInfo().indicatorTranslatedRoles[role],
      value: role,
    }
  })

export const indicatorTypeFromTranslatedType = (
  translatedType: string,
): IndicatorType => {
  const { indicatorTranslatedTypes: translatedIndicatorTypes } =
    getIndicatorFieldsInfo()
  const entry = Object.entries(translatedIndicatorTypes).find(
    ([key, value]) => value === translatedType,
  ) as any
  return entry[0] as IndicatorType
}

export const findStatusesByTranslatedStatus = (
  translatedStatus: string,
): string[] => {
  if (!translatedStatus) return []
  return getIndicatorFieldsInfo()
    .indicatorTypes.map(
      (type) => getIndicatorFieldsInfo().indicatorTranslatedTypes[type],
    )
    .filter((indicatorTranslatedType) =>
      indicatorTranslatedType.toLowerCase().includes(translatedStatus.toLowerCase()),
    )
    .map((value) => indicatorTypeFromTranslatedType(value))
}
