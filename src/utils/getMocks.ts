import { User } from '@Domain/User'
import Profile from '@Domain/Profile'
import UsersGroup from '@Domain/UsersGroup'
import Company from '@Domain/Company'
import UsersSkills from '@Domain/UsersSkills'

import { Skill } from '@Domain/Skill'

import { Idea, IdeaSkills, Rating } from '@Domain/Idea'
import Comment from '@Domain/Comment'

import {
  RequestToTeam,
  Team,
  TeamInvitation,
  TeamMember,
  TeamSkills,
} from '@Domain/Team'

import Notification from '@Domain/Notification'

interface Mocks {
  users: User[]
  usersEmails: string[]
  profiles: Profile[]
  usersGroups: UsersGroup[]
  usersSkills: UsersSkills[]

  companies: Company[]

  skills: Skill[]

  ideas: Idea[]
  ideasSkills: IdeaSkills[]
  ratings: Rating[]
  comments: Comment[]

  teams: Team[]
  teamMembers: TeamMember[]
  teamInvitations: TeamInvitation[]
  requestsToTeam: RequestToTeam[]
  teamSkills: TeamSkills[]

  notifications: Notification[]
}

function getMocks(): Mocks {
  const users: User[] = [
    {
      id: '0',
      token: '10296538',
      email: 'admin@mail.com',
      firstName: 'Админ',
      lastName: 'Админ',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
    },
    {
      id: '1',
      token: '613098',
      email: '1@mail.com',
      firstName: 'Иван',
      lastName: 'Иванович',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
    },
    {
      id: '2',
      token: '059182',
      email: '2@mail.com',
      firstName: 'Менеджер',
      lastName: 'Менеджер',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
    },
    {
      id: '3',
      token: '163097',
      email: '3@mail.com',
      firstName: 'Владелец',
      lastName: 'Владелец',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
    },
    {
      id: '4',
      token: '8755764',
      email: '4@mail.com',
      firstName: 'Винрит',
      lastName: 'Загрев',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
    },
    {
      id: '5',
      token: '836444',
      email: '5@mail.com',
      firstName: 'Версаль',
      lastName: 'Кустерман',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
    },
    // {
    //   id: '6',
    //   token: '6745354',
    //   email: '6@mail.com',
    //   firstName: 'Дмитрий',
    //   lastName: 'Амонов',
    //   roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
    // },
  ]

  const teamMembers: TeamMember[] = [
    {
      id: '0',
      teamId: '1',
      userId: '1',
      email: 'timyr@mail.com',
      firstName: 'Тимур',
      lastName: 'Минязев',
      skills: [],
    },
    {
      id: '1',
      teamId: '1',
      userId: '233969a1-ac39-4ee2-be75-9866693e7336',
      email: 'kirill.vlasov.05@inbox.ru',
      firstName: 'Кирилл',
      lastName: 'Власов',
      skills: [],
    },
    {
      id: '2',
      teamId: '0',
      userId: '3',
      email: 'admin@mail.com',
      firstName: 'Админ',
      lastName: 'Иванов',
      skills: [],
    },
    {
      id: '3',
      teamId: '1',
      userId: '4',
      email: 'deins@mail.com',
      firstName: 'Денис',
      lastName: 'Денисович',
      skills: [],
    },
  ]

  const usersEmails: string[] = users.map((user) => user.email)
  const skills: Skill[] = [
    {
      id: '0',
      name: 'JavaScript',
      type: 'LANGUAGE',
      confirmed: true,
    },
    {
      id: '1',
      name: 'Python',
      type: 'LANGUAGE',
      confirmed: true,
    },
    {
      id: '2',
      name: 'Rust',
      type: 'LANGUAGE',
      confirmed: true,
    },
    {
      id: '3',
      name: 'Swift',
      type: 'LANGUAGE',
      confirmed: true,
    },
    {
      id: '4',
      name: 'Kotlin',
      type: 'LANGUAGE',
      confirmed: true,
    },
    {
      id: '5',
      name: 'Go',
      type: 'LANGUAGE',
      confirmed: true,
    },
    {
      id: '6',
      name: 'React JS',
      type: 'FRAMEWORK',
      confirmed: true,
    },
    {
      id: '7',
      name: 'C++',
      type: 'LANGUAGE',
      confirmed: true,
    },
    {
      id: '8',
      name: 'VueJS',
      type: 'FRAMEWORK',
      confirmed: true,
    },
    {
      id: '9',
      name: 'Angular',
      type: 'FRAMEWORK',
      confirmed: true,
    },
    {
      id: '10',
      name: 'NodeJS',
      type: 'FRAMEWORK',
      confirmed: true,
    },
    {
      id: '11',
      name: 'Docker',
      type: 'DEVOPS',
      confirmed: true,
    },
    {
      id: '12',
      name: 'Git',
      type: 'DEVOPS',
      confirmed: true,
    },
    {
      id: '13',
      name: 'Grafana',
      type: 'DEVOPS',
      confirmed: true,
    },
    {
      id: '14',
      name: 'Elasticsearch',
      type: 'DEVOPS',
      confirmed: true,
    },
    {
      id: '15',
      name: 'MongoDB',
      type: 'DATABASE',
      confirmed: true,
    },
    {
      id: '16',
      name: 'PostgreSQL',
      type: 'DATABASE',
      confirmed: true,
    },
    {
      id: '17',
      name: 'MySQL',
      type: 'DATABASE',
      confirmed: true,
    },
    {
      id: '18',
      name: 'SQLite',
      type: 'DATABASE',
      confirmed: true,
    },
    {
      id: '19',
      name: 'Redis',
      type: 'DATABASE',
      confirmed: true,
    },
  ]

  const usersSkills: UsersSkills[] = [
    {
      idUsers: '0',
      skills: [skills[0], skills[4], skills[6], skills[9]],
    },
    {
      idUsers: '1',
      skills: [skills[1], skills[2], skills[7], skills[19]],
    },
    {
      idUsers: '2',
      skills: [skills[0], skills[1], skills[9], skills[19]],
    },
    {
      idUsers: '3',
      skills: [skills[1], skills[5], skills[6], skills[17]],
    },
    {
      idUsers: '4',
      skills: [skills[1], skills[2], skills[3], skills[16]],
    },
    {
      idUsers: '5',
      skills: [skills[0], skills[2], skills[7], skills[15]],
    },
    {
      idUsers: '6',
      skills: [skills[2], skills[2], skills[7], skills[11]],
    },
  ]

  const teams: Team[] = [
    {
      id: '0',
      name: 'Лидер',
      closed: false,
      createdAt: '2023-10-20T11:02:17Z',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      membersCount: 4,
      owner: teamMembers[0],
      leader: teamMembers[1],
      members: [...teamMembers],
      totalSkills: [skills[0], skills[4], skills[6], skills[9]],
      wantedSkills: [skills[0], skills[11], skills[16]],
    },
    {
      id: '4',
      name: 'Приглашения',
      closed: false,
      createdAt: '2023-10-20T11:02:17Z',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      membersCount: 2,
      owner: teamMembers[0],
      leader: teamMembers[2],
      members: [teamMembers[0], teamMembers[2]],
      totalSkills: [skills[0], skills[4], skills[6], skills[9]],
      wantedSkills: [skills[0], skills[11], skills[16]],
    },
    {
      id: '5',
      name: 'Заявки',
      closed: false,
      createdAt: '2023-10-20T11:02:17Z',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      membersCount: 2,
      owner: teamMembers[0],
      leader: teamMembers[2],
      members: [teamMembers[0], teamMembers[2]],
      totalSkills: [skills[0], skills[4], skills[6], skills[9]],
      wantedSkills: [skills[0], skills[11], skills[16]],
    },
    {
      id: '6',
      name: 'Пользователь(Открытая)',
      closed: false,
      createdAt: '2023-10-20T11:02:17Z',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      membersCount: 2,
      owner: teamMembers[0],
      leader: teamMembers[2],
      members: [teamMembers[0], teamMembers[2]],
      totalSkills: [skills[0], skills[4], skills[6], skills[9]],
      wantedSkills: [skills[0], skills[11], skills[16]],
    },
    {
      id: '7',
      name: 'Пользователь(Закрытая)',
      closed: true,
      createdAt: '2023-10-20T11:02:17Z',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      membersCount: 2,
      owner: teamMembers[0],
      leader: teamMembers[2],
      members: [teamMembers[0], teamMembers[2]],
      totalSkills: [skills[0], skills[4], skills[6], skills[9]],
      wantedSkills: [skills[0], skills[11], skills[16]],
    },
    {
      id: '1',
      name: 'Участник',
      closed: false,
      createdAt: '2023-10-20T11:02:17Z',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      membersCount: 3,
      owner: teamMembers[0],
      leader: teamMembers[2],
      members: [teamMembers[0], teamMembers[1], teamMembers[2]],
      totalSkills: [
        skills[0],
        skills[1],
        skills[7],
        skills[8],
        skills[9],
        skills[11],
        skills[12],
        skills[13],
        skills[16],
        skills[17],
        skills[18],
        skills[19],
      ],
      wantedSkills: [
        skills[0],
        skills[1],
        skills[5],
        skills[8],
        skills[9],
        skills[10],
        skills[18],
        skills[17],
        skills[16],
        skills[15],
        skills[11],
        skills[12],
        skills[13],
      ],
    },
    {
      id: '2',
      name: 'Владелец',
      closed: false,
      createdAt: '2023-10-30T11:02:17Z',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      membersCount: 1,
      owner: teamMembers[1],
      leader: teamMembers[2],
      members: [teamMembers[1], teamMembers[2]],
      totalSkills: [skills[0], skills[1], skills[11], skills[13], skills[16]],
      wantedSkills: [skills[2], skills[3], skills[8], skills[12]],
    },
  ]

  const teamSkills: TeamSkills[] = [
    {
      teamId: '0',
      wantedSkills: [skills[0], skills[2]],
      totalSkills: [],
    },
    {
      teamId: '1',
      wantedSkills: [
        skills[0],
        skills[1],
        skills[5],
        skills[8],
        skills[9],
        skills[10],
        skills[18],
        skills[17],
        skills[16],
        skills[15],
        skills[11],
        skills[12],
        skills[13],
      ],
      totalSkills: [
        skills[0],
        skills[1],
        skills[7],
        skills[8],
        skills[9],
        skills[11],
        skills[12],
        skills[13],
        skills[16],
        skills[17],
        skills[18],
        skills[19],
      ],
    },
  ]

  const teamInvitations: TeamInvitation[] = [
    {
      id: '0',
      teamId: '1',
      userId: '3',
      email: 'maga@mail.com',
      status: 'ACCEPTED',
      firstName: 'Мамедага',
      lastName: 'Байрамов',
    },
    {
      id: '3',
      teamId: '4',
      userId: '233969a1-ac39-4ee2-be75-9866693e7336',
      email: 'kirill.vlasov.05@inbox.ru',
      status: 'NEW',
      firstName: 'Кирилл',
      lastName: 'Власов',
    },
    {
      id: '1',
      teamId: '0',
      userId: '1',
      status: 'ACCEPTED',
      email: 'timyr@mail.com',
      firstName: 'Тимур',
      lastName: 'Минязев',
    },
    {
      id: '2',
      teamId: '1',
      userId: '4',
      status: 'ACCEPTED',
      email: 'admin@mail.com',
      firstName: 'Админ',
      lastName: 'Иванов',
    },
  ]
  const requestsToTeam: RequestToTeam[] = [
    {
      id: '1',
      teamId: '0',
      status: 'NEW',
      userId: '5',
      email: 'deins@mail.com',
      firstName: 'Денис',
      lastName: 'Денисович',
    },
    {
      id: '3',
      teamId: '5',
      userId: '233969a1-ac39-4ee2-be75-9866693e7336',
      email: 'kirill.vlasov.05@inbox.ru',
      status: 'NEW',
      firstName: 'Кирилл',
      lastName: 'Власов',
    },
    {
      id: '2',
      teamId: '1',
      userId: '3',
      status: 'NEW',
      email: 'maga@mail.com',
      firstName: 'Мамедага',
      lastName: 'Байрамов',
    },
  ]

  const usersGroups: UsersGroup[] = [
    {
      id: '0',
      name: 'Группа разработчиков',
      users: [...users],
      roles: ['INITIATOR'],
    },
    {
      id: '1',
      name: 'Группа экспертов',
      users: [],
      roles: ['ADMIN', 'EXPERT'],
    },
  ]

  const comments: Comment[] = [
    {
      id: '0',
      ideaId: '0',
      createdAt: '2023-10-20T11:02:17Z',

      senderEmail: 'andrey@mail.com',
      text: 'Комментарий 1',
      checkedBy: [],
    },
    {
      id: '1',
      ideaId: '0',
      createdAt: '2023-10-21T11:02:17Z',

      senderEmail: 'timyr@mail.com',
      text: 'Комментарий 2',
      checkedBy: ['0', '1'],
    },
    {
      id: '2',
      ideaId: '1',
      createdAt: '2023-10-21T11:02:17Z',

      senderEmail: 'kirill.vlasov.05@inbox.ru',
      text: 'Требуются Frontend разработчики!',
      checkedBy: [],
    },
    {
      id: '2',
      ideaId: '2',
      createdAt: '2023-10-21T11:02:17Z',

      senderEmail: 'kirill.vlasov.05@inbox.ru',
      text: 'Скоро закроется набор!',
      checkedBy: [],
    },
  ]
  const ratings: Rating[] = [
    {
      id: '0',
      ideaId: '0',
      expertId: '0',
      budget: 1,
      technicalRealizability: null,
      suitability: 2,
      rating: 8 / 5,
      originality: 3,
      marketValue: 1,
      confirmed: false,
    },
    {
      id: '1',
      ideaId: '0',
      expertId: '1',
      budget: 2,
      technicalRealizability: 4,
      suitability: 5,
      rating: 14 / 5,
      originality: 1,
      marketValue: 2,
      confirmed: true,
    },
    {
      id: '2',
      ideaId: '1',
      expertId: '2',
      budget: 1,
      technicalRealizability: 1,
      suitability: 5,
      rating: null,
      originality: null,
      marketValue: null,
      confirmed: false,
    },
  ]
  const ideas: Idea[] = [
    {
      id: '0',
      initiatorEmail: 'admin@mail.com',
      name: 'Рефактор кода',
      problem:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      solution:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      result:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      createdAt: '2023-10-21T11:02:17Z',
      modifiedAt: '2023-10-26T11:02:17Z',
      status: 'ON_CONFIRMATION',
      maxTeamSize: 7,
      minTeamSize: 3,
      customer: 'ВШЦТ',
      contactPerson: 'ВШЦТ',
      experts: null,
      projectOffice: null,
      budget: 1,
      suitability: 1,
      preAssessment: 1,
      rating: null,
    },
    {
      id: '1',
      initiatorEmail: '1@mail.com',
      name: 'Реактор железного человека',
      problem:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      solution:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      result:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      createdAt: '2023-10-24T11:02:17Z',
      modifiedAt: '2023-10-25T11:02:17Z',
      status: 'NEW',
      maxTeamSize: 4,
      minTeamSize: 3,
      customer: 'ВШЦТ',
      contactPerson: 'ВШЦТ',
      experts: null,
      projectOffice: null,
      budget: 4,
      suitability: 3,
      preAssessment: 4,
      rating: 2,
    },
    {
      id: '2',
      initiatorEmail: '2@mail.com',
      name: 'Идея 2',
      problem:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      solution:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      result:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      createdAt: '2023-10-25T11:02:17Z',
      modifiedAt: '2023-10-25T11:02:17Z',
      status: 'NEW',
      maxTeamSize: 5,
      minTeamSize: 5,
      customer: 'ВШЦТ',
      contactPerson: 'ВШЦТ',
      experts: null,
      projectOffice: null,
      budget: 4,
      suitability: 3,
      preAssessment: 4,
      rating: 4,
    },
    {
      id: '3',
      initiatorEmail: '3@mail.com',
      name: 'Раскладушка',
      problem:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      solution:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      result:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      createdAt: '2023-10-25T11:02:17Z',
      modifiedAt: '2023-10-25T11:02:17Z',
      status: 'CONFIRMED',
      maxTeamSize: 5,
      minTeamSize: 5,
      customer: 'ВШЦТ',
      contactPerson: 'ВШЦТ',
      experts: null,
      projectOffice: null,
      budget: 4,
      suitability: 3,
      preAssessment: 4,
      rating: 4,
    },
  ]
  const ideasSkills: IdeaSkills[] = [
    { ideaId: '0', skills: [...skills] },
    {
      ideaId: '1',
      skills: [skills[0], skills[2]],
    },
  ]

  const profiles: Profile[] = [
    {
      ...users[0],
      skills: [
        skills[1],
        skills[3],
        skills[4],
        skills[6],
        skills[5],
        skills[7],
        skills[8],
        skills[9],
      ],
      ideas: [ideas[0], ideas[1]],
      projects: [
        {
          id: '0',
          name: 'Деление на 0',
          description: 'Очень важно',
        },
        {
          id: '1',
          name: 'Спасение экосистемы',
          description: 'Технология эффективного спасения',
        },
        {
          id: '2',
          name: 'Важный проект',
          description: 'Очень важный проект',
        },
      ],
    },
    {
      ...users[1],
      skills: [
        skills[0],
        skills[2],
        skills[6],
        skills[5],
        skills[7],
        skills[8],
        skills[9],
        skills[10],
        skills[11],
        skills[12],
        skills[13],
        skills[14],
      ],
      ideas: [ideas[2], ideas[1]],
      projects: [
        {
          id: '0',
          name: 'Поднятие уровня моря',
          description: 'Надо бы поднять уровень моря',
        },
        {
          id: '1',
          name: 'Еда экспресс',
          description: 'Технология эффективного питания',
        },
        {
          id: '2',
          name: 'Создание квантового компьютера',
          description: 'Очень важный проект',
        },
      ],
    },
  ]

  const notifications: Notification[] = [
    {
      id: '0',
      userId: '0',
      title: 'Чат 1',
      message: 'Попов(менеджер, проект 1): дедлайн завтра',
      isShowed: true,
      isReaded: false,
      isFavourite: false,
      createdAt: '2023-10-25T11:02:17Z',
    },
    {
      id: '1',
      userId: '1',
      title: 'Чат 2',
      message: 'Петров(менеджер, проект 2): завтра',
      isShowed: false,
      isReaded: false,
      isFavourite: false,
      createdAt: '2023-10-28T11:02:17Z',
    },
    {
      id: '2',
      userId: '2',
      title: 'Чат 1',
      message: 'Попов(менеджер, проект 1): дедлайн завтра',
      isShowed: false,
      isReaded: true,
      isFavourite: false,
      createdAt: '2023-10-20T11:02:17Z',
    },
    {
      id: '3',
      userId: '2',
      title: 'Чат 2',
      message: 'Петров(менеджер, проект 2): дедлайн завтра',
      isShowed: true,
      isReaded: true,
      isFavourite: false,
      createdAt: '2023-10-30T11:02:17Z',
    },
  ]
  const companies: Company[] = [
    {
      id: '0',
      name: 'ВШЦТ',
      owner: users[1],
      users: [users[2]],
    },
    {
      id: '1',
      name: 'Газпром',
      owner: users[1],
      users: [users[1]],
    },
    {
      id: '2',
      name: 'Роснефть',
      owner: users[2],
      users: [users[1]],
    },
  ]

  return {
    users,
    usersEmails,
    profiles,
    skills,
    usersSkills,
    teamSkills,
    usersGroups,
    companies,

    ideas,
    ideasSkills,
    ratings,
    comments,

    teams,
    teamMembers,
    requestsToTeam,
    teamInvitations,

    notifications,
  }
}
export default getMocks
