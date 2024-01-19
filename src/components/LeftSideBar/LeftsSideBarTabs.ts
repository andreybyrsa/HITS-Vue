import LeftSideBarTabType from '@Components/LeftSideBar/LeftSideBar.types'

const leftSideBarTabs: LeftSideBarTabType[] = [
  {
    name: 'ideas',
    text: 'Реестр идей',
    to: '/ideas',
    routes: [
      {
        name: 'ideas-list',
        text: 'Список идей',
        to: '/ideas/list',
        iconName: 'bi bi-list',
        roles: ['INITIATOR', 'MEMBER', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
      },
      {
        name: 'create-idea',
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
    name: 'teams',
    text: 'Реестр команд',
    to: '/teams',
    routes: [
      {
        name: 'teams-list',
        text: 'Список команд',
        to: '/teams/list',
        iconName: 'bi bi-list',
        roles: ['INITIATOR', 'TEAM_OWNER', 'TEAM_LEADER', 'MEMBER', 'ADMIN'],
      },
      {
        name: 'create-team',
        text: 'Создать команду',
        to: '/teams/create',
        iconName: 'bi bi-plus-lg',
        roles: ['TEAM_OWNER', 'ADMIN'],
      },
    ],
    iconName: 'bi bi-people',
    roles: ['INITIATOR', 'TEAM_OWNER', 'TEAM_LEADER', 'MEMBER', 'ADMIN'],
  },
  {
    name: 'markets',
    text: 'Реестр бирж',
    to: '/market',
    routes: [
      {
        name: 'markets-list',
        text: 'Список бирж',
        to: '/market/list',
        iconName: 'bi bi-list',
        roles: ['PROJECT_OFFICE', 'ADMIN'],
      },
    ],
    iconName: 'bi bi-shop-window',
    roles: ['INITIATOR', 'MEMBER', 'TEAM_OWNER', 'PROJECT_OFFICE', 'ADMIN'],
  },
  {
    name: 'admin',
    text: 'Админ панель',
    to: '/admin',
    routes: [
      {
        name: 'admin-users',
        to: '/admin/users',
        text: 'Пользователи',
        iconName: 'bi bi-person-gear',
        roles: ['ADMIN'],
      },
      {
        name: 'admin-add-users',
        to: '/admin/add-users',
        text: 'Добавить пользователей',
        iconName: 'bi bi-person-add',
        roles: ['ADMIN'],
      },
      {
        name: 'admin-companies',
        to: '/admin/companies',
        text: 'Компании',
        iconName: 'bi bi-building',
        roles: ['ADMIN'],
      },
      {
        name: 'admin-users-groups',
        to: '/admin/users-groups',
        text: 'Группы пользователей',
        iconName: 'bi bi-people',
        roles: ['ADMIN'],
      },
      {
        name: 'admin-skills',
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
    name: 'projects',
    text: 'Реестр проектов',
    to: '/projects',
    routes: [
      {
        name: 'list',
        text: 'Список проектов',
        to: '/projects/list',
        iconName: 'bi bi-list',
        roles: ['PROJECT_OFFICE', 'ADMIN'],
      },
    ],
    iconName: 'bi bi-briefcase',
    roles: [
      'INITIATOR',
      'MEMBER',
      'TEAM_OWNER',
      'PROJECT_OFFICE',
      'ADMIN',
      'TEAM_LEADER',
    ],
  },
]

export default leftSideBarTabs
