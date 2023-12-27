import { IdeaMarketTabType } from '@Components/Modals/IdeaMarketModal/IdeaMarketModal.types'

const IdeaMarketInfoTabs: IdeaMarketTabType[] = [
  {
    id: '0',
    key: 'customer',
    name: 'Заказчик',
    icon: 'bi bi-person-circle',
  },
  {
    id: '1',
    key: 'initiator',
    name: 'Инициатор',
    icon: 'bi bi-envelope',
  },
  {
    id: '2',
    key: 'status',
    name: 'Статус',
    icon: 'bi bi-check2-all',
  },
  {
    id: '3',
    key: 'startDate',
    name: 'Дата старта проекта',
    icon: 'bi bi-calendar',
  },
  {
    id: '4',
    key: 'finishDate',
    name: 'Дата окончания проекта',
    icon: 'bi bi-calendar',
  },
]

export default IdeaMarketInfoTabs
