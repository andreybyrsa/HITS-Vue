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
        roles: ['INITIATOR', 'MEMBER', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
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
    roles: ['INITIATOR', 'MEMBER', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
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
        roles: ['INITIATOR', 'TEAM_OWNER', 'MEMBER', 'ADMIN'],
      },
      {
        id: 5,
        text: 'Создать команду',
        to: '/teams/create',
        iconName: 'bi bi-plus-lg',
        roles: ['TEAM_OWNER', 'ADMIN'],
      },
    ],
    iconName: 'bi bi-people',
    roles: ['INITIATOR', 'TEAM_OWNER', 'MEMBER', 'ADMIN'],
  },
  {
    id: 6,
    text: 'Биржа идей',
    to: '/market',
    iconName: 'bi bi-basket3',
    roles: getRoles().roles,
  },
  {
    id: 7,
    text: 'Админ панель',
    to: '/admin',
    routes: [
      {
        id: 8,
        to: '/admin/users',
        text: 'Пользователи',
        iconName: 'bi bi-person-gear',
        roles: ['ADMIN'],
      },
      {
        id: 9,
        to: '/admin/add-users',
        text: 'Добавить пользователей',
        iconName: 'bi bi-person-add',
        roles: ['ADMIN'],
      },
      {
        id: 10,
        to: '/admin/companies',
        text: 'Компании',
        iconName: 'bi bi-building',
        roles: ['ADMIN'],
      },
      {
        id: 11,
        to: '/admin/users-groups',
        text: 'Группы пользователей',
        iconName: 'bi bi-people',
        roles: ['ADMIN'],
      },
      {
        id: 12,
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
    id: 14,
    text: 'Настройки',
    to: '/change-email',
    routes: [
      {
        id: 15,
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
