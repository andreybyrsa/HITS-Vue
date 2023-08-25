const projectTypeOptions = [
  { value: 'INSIDE', label: 'Внутренний' },
  { value: 'OUTSIDE', label: 'Внешний' },
]

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

export { projectTypeOptions, textareas }
