import LeftSideBarTabType from '@Components/LeftSideBar/LeftSideBar.types'

import getRoles from '@Utils/getRoles'

const leftSideBarTabs: LeftSideBarTabType[] = [
  {
    id: 0,
    text: 'Реестр идей',
    to: '/ideas',
    routes: [
      {
        id: 1,
        text: 'Список идей',
        to: '/ideas/list',
        iconName: 'bi bi-list',
        roles: getRoles().roles,
      },
      {
        id: 2,
        text: 'Создать идею',
        to: '/ideas/create',
        iconName: 'bi bi-plus-lg',
        roles: ['INITIATOR', 'ADMIN'],
      },
    ],
    iconName: 'bi bi-lightbulb',
    roles: getRoles().roles,
  },
  {
    id: 3,
    text: 'Реестр команд',
    to: '/teams',
    routes: [
      {
        id: 4,
        text: 'Список команд',
        to: '/teams/list',
        iconName: 'bi bi-list',
        roles: getRoles().roles,
      },
      {
        id: 5,
        text: 'Создать команду',
        to: '/teams/create',
        iconName: 'bi bi-plus-lg',
        roles: getRoles().roles,
      },
    ],
    iconName: 'bi bi-people',
    roles: getRoles().roles,
  },
  {
    id: 6,
    text: 'Журнал изменений',
    to: '/last-activity-note',
    iconName: 'bi bi-book',
    roles: getRoles().roles,
  },
  {
    id: 7,
    text: 'Админ панель',
    to: '/admin',
    routes: [
      {
        id: 8,
        to: '/admin/add-users',
        text: 'Добавить пользователей',
        iconName: 'bi bi-person-add',
        roles: ['ADMIN'],
      },
      {
        id: 9,
        to: '/admin/edit-users',
        text: 'Редактировать пользователей',
        iconName: 'bi bi-person-gear',
        roles: ['ADMIN'],
      },
      {
        id: 10,
        to: '/admin/users-groups',
        text: 'Группы пользователей',
        iconName: 'bi bi-people',
        roles: ['ADMIN'],
      },
      {
        id: 11,
        to: '/admin/skills',
        text: 'Справочник компетенций',
        iconName: 'bi bi-person-badge',
        roles: ['ADMIN'],
      },
    ],
    iconName: 'bi bi-ui-checks-grid',
    roles: ['ADMIN'],
  },
  {
    id: 12,
    text: 'Отчеты',
    to: '/notes',
    iconName: 'bi bi-file-earmark',
    roles: ['EXPERT', 'ADMIN'],
  },
  {
    id: 13,
    text: 'Настройки',
    to: '/change-email',
    routes: [
      {
        id: 14,
        to: '/change-email',
        text: 'Изменение почты',
        iconName: 'bi bi-pencil-square',
        roles: getRoles().roles,
      },
    ],
    iconName: 'bi bi-gear',
    roles: getRoles().roles,
  },
]

export default leftSideBarTabs
