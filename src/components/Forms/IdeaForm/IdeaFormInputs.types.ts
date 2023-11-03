import { Idea } from '@Domain/Idea'

interface IdeaFormInputsEmits {
  (
    event: 'set-value',
    field: keyof Idea,
    value: number | string,
    shouldValidate?: boolean,
  ): void
}

const textareas = [
  {
    name: 'problem',
    label: 'Проблема*',
    placeholder: 'Опишите проблему, которую решает ваша идея',
  },
  {
    name: 'solution',
    label: 'Предлагаемое решение*',
    placeholder: 'Опишите, что вы предлагаете для решения проблемы',
  },
  {
    name: 'result',
    label: 'Ожидаемый результат*',
    placeholder: 'Опишите ожидаемый результат',
  },
  {
    name: 'description',
    label: 'Описание необходимых ресурсов для реализации*',
    placeholder: 'Укажите список требуемых для выполнения проекта ресурсов',
  },
]

export { IdeaFormInputsEmits, textareas }
