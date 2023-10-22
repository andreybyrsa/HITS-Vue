import { IdeaModalCollapseType } from '@Components/Modals/IdeaModal/IdeaModal.types'

const ideaModalCollapses: IdeaModalCollapseType[] = [
  { key: 0, id: 'problem', ideaKey: 'problem', text: 'Проблема' },
  { key: 1, id: 'solution', ideaKey: 'solution', text: 'Предлагаемое решение' },
  { key: 2, id: 'result', ideaKey: 'result', text: 'Ожидаемый результат' },
  {
    key: 3,
    id: 'description',
    ideaKey: 'description',
    text: 'Описание необходимых ресурсов для реализации',
  },
]

export default ideaModalCollapses
