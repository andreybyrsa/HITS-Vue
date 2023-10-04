import LeftSideBarTabType from '@Components/LeftSideBar/LeftSideBar.types'

import getRoles from '@Utils/getRoles'

const leftSideBarTabs: LeftSideBarTabType[] = [
  {
    id: 0,
    text: 'Список идей',
    to: '/ideas',
    iconName: 'bi bi-list',
    roles: getRoles().roles,
  },
  {
    id: 1,
    text: 'Добавить идею',
    to: '/add-idea',
    iconName: 'bi bi-plus-lg',
    roles: ['ADMIN', 'INITIATOR'],
  },
  {
    id: 2,
    text: 'Журнал изменений',
    to: '/last-activity-note',
    iconName: 'bi bi-book',
    roles: getRoles().roles,
  },
  {
    id: 3,
    text: 'Админ панель',
    to: '/admin',
    routes: [
      {
        id: 0,
        to: '/admin/add-users',
        text: 'Добавить пользователей',
        iconName: 'bi bi-person-add',
      },
      {
        id: 1,
        to: '/admin/edit-users',
        text: 'Редактировать пользователей',
        iconName: 'bi bi-person-gear',
      },
      {
        id: 2,
        to: '/admin/users-groups',
        text: 'Группы пользователей',
        iconName: 'bi bi-people',
      },
      {
        id: 3,
        to: '/admin/skills',
        text: 'Справочник компетенций',
        iconName: 'bi bi-person-badge',
      },
    ],
    iconName: 'bi bi-ui-checks-grid',
    roles: ['ADMIN'],
  },
  {
    id: 4,
    text: 'Отчеты',
    to: '/notes',
    iconName: 'bi bi-file-earmark',
    roles: ['EXPERT', 'ADMIN'],
  },
]

export default leftSideBarTabs
