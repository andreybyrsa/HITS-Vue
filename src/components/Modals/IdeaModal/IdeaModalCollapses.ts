import { IdeaModalCollapseType } from '@Components/Modals/IdeaModal/IdeaModal.types'

const ideaModalCollapses: IdeaModalCollapseType[] = [
  { key: '0', id: '0', ideaKey: 'problem', text: 'Проблема' },
  { key: '1', id: '1', ideaKey: 'solution', text: 'Предлагаемое решение' },
  { key: '2', id: '2', ideaKey: 'result', text: 'Ожидаемый результат' },
  {
    key: '3',
    id: '3',
    ideaKey: 'description',
    text: 'Описание необходимых ресурсов для реализации',
  },
]

export default ideaModalCollapses
