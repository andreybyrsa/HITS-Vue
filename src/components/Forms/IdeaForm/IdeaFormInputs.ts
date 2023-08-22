const projectTypeOptions = [
  { value: 'INSIDE', label: 'Внутренний' },
  { value: 'OUTSIDE', label: 'Внешний' },
]

const textareas = [
  {
    name: 'problem',
    label: 'Проблема*',
    className: 'fs-6',
    placeholder: 'Опишите проблему, которую решает ваша идея',
  },
  {
    name: 'solution',
    label: 'Предлагаемое решение*',
    className: 'fs-6',
    placeholder: 'Опишите, что вы предлагаете для решения проблемы',
  },
  {
    name: 'result',
    label: 'Ожидаемый результат*',
    className: 'fs-6',
    placeholder: 'Опишите ожидаемый результат',
  },
  {
    name: 'description',
    label: 'Описание необходимых ресурсов для реализации*',
    className: 'fs-6',
    placeholder: 'Укажите список требуемых для выполнения проекта ресурсов',
  },
]

export { projectTypeOptions, textareas }
