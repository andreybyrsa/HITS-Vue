import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'
import UsersGroup from '@Domain/UsersGroup'
import Comment from '@Domain/Comment'
import { Idea, IdeaSkills, Rating } from '@Domain/Idea'
import Team from '@Domain/Team'
import TeamMember from '@Domain/TeamMember'
import IdeasMarket from '@Domain/IdeasMarket'

interface Mocks {
  users: User[]
  usersEmails: string[]
  skills: Skill[]
  usersGroups: UsersGroup[]
  teamMember: TeamMember[]
  comments: Comment[]
  ideas: Idea[]
  ratings: Rating[]
  ideasSkills: IdeaSkills[]
  teams: Team[]
  IdeasMarket: IdeasMarket[]
}

function getMocks(): Mocks {
  const users: User[] = [
    {
      id: 0,
      token: '10296538',
      email: 'admin@mail.com',
      firstName: 'Админ',
      lastName: 'Админ',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
    },

    {
      id: 1,
      token: '613098',
      email: '1@mail.com',
      firstName: 'Пользователь',
      lastName: 'Пользователь',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
    },

    {
      id: 2,
      token: '059182',
      email: '2@mail.com',
      firstName: 'Менеджер',
      lastName: 'Менеджер',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
    },

    {
      id: 3,
      token: '163097',
      email: '3@mail.com',
      firstName: 'Владелец',
      lastName: 'Владелец',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
    },
  ]

  const usersEmails: string[] = users.map((user) => user.email)

  const skills: Skill[] = [
    {
      id: 0,
      name: 'JavaScript',
      type: 'LANGUAGE',
      confirmed: true,
    },
    {
      id: 1,
      name: 'React JS',
      type: 'FRAMEWORK',
      confirmed: true,
    },
    {
      id: 2,
      name: 'C++',
      type: 'LANGUAGE',
      confirmed: false,
    },
  ]

  const usersGroups: UsersGroup[] = [
    {
      id: 0,
      name: 'Группа разработчиков',
      users: [...users],
      roles: ['INITIATOR'],
    },
    {
      id: 1,
      name: 'Группа экспертов',
      users: [],
      roles: ['ADMIN', 'EXPERT'],
    },
  ]

  const teamMember: TeamMember[] = [
    {
      email: 'admin@mail.com',
      firstName: 'Админ',
      lastName: 'Адмиг',

      skills: [...skills],
    },
    {
      email: '1@mail.com',
      firstName: 'Пользователь',
      lastName: 'Пользователь',

      skills: [
        {
          id: 2,
          name: 'C++',
          type: 'LANGUAGE',
          confirmed: false,
        },
      ],
    },
    {
      email: '2@mail.com',
      firstName: 'Менеджер',
      lastName: 'Менеджер',

      skills: [
        {
          id: 0,
          name: 'JavaScript',
          type: 'LANGUAGE',
          confirmed: true,
        },
        {
          id: 1,
          name: 'React JS',
          type: 'FRAMEWORK',
          confirmed: true,
        },
      ],
    },
    {
      email: '3@mail.com',
      firstName: 'Владелец',
      lastName: 'Владелец',

      skills: [...skills],
    },
  ]

  const comments: Comment[] = [
    {
      id: 0,
      ideaId: 0,
      createdAt: '2023-10-20T11:02:17Z',

      senderEmail: 'admin@mail.com',
      text: 'Комментарий 1',
      checkedBy: [],
    },
    {
      id: 1,
      ideaId: 0,
      createdAt: '2023-10-21T11:02:17Z',

      senderEmail: '1@mail.com',
      text: 'Комментарий 2',
      checkedBy: [0, 1],
    },
    {
      id: 2,
      ideaId: 1,
      createdAt: '2023-10-21T11:02:17Z',

      senderEmail: '2@mail.com',
      text: 'Комментарий 3',
      checkedBy: [],
    },
  ]

  const ratings: Rating[] = [
    {
      id: 0,
      ideaId: 0,
      expertId: 0,
      budget: 1,
      technicalRealizability: 1,
      suitability: 2,
      rating: 8 / 5,
      originality: 3,
      marketValue: 1,
      confirmed: false,
    },
    {
      id: 1,
      ideaId: 0,
      expertId: 1,
      budget: 2,
      technicalRealizability: 4,
      suitability: 5,
      rating: 14 / 5,
      originality: 1,
      marketValue: 2,
      confirmed: false,
    },
    {
      id: 2,
      ideaId: 1,
      expertId: 2,
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
      id: 0,
      initiator: 'admin@mail.com',
      name: 'Идея по созданию идеи',
      projectType: 'INSIDE',
      problem:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      solution:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      result:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      createdAt: new Date(),
      modifiedAt: new Date(),
      status: 'ON_CONFIRMATION',
      customer: 'ВШЦТ',
      contactPerson: 'ВШЦТ',
      experts: null,
      projectOffice: null,
      budget: 1,
      suitability: 1,
      technicalRealizability: 1,
      preAssessment: 1,
      rating: 8 / 5,
    },
    {
      id: 1,
      initiator: 'admin@mail.com',
      name: 'Идея 1',
      projectType: 'INSIDE',
      problem:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      solution:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      result:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      createdAt: new Date(),
      modifiedAt: new Date(),
      status: 'NEW',
      customer: 'ВШЦТ',
      contactPerson: 'ВШЦТ',
      experts: null,
      projectOffice: null,
      budget: 4,
      suitability: 3,
      technicalRealizability: 5,
      preAssessment: 4,
      rating: null,
    },
  ]

  const ideasSkills: IdeaSkills[] = [
    { ideaId: 0, skills: [...skills] },
    {
      ideaId: 1,
      skills: [skills[0], skills[2]],
    },
  ]

  const teams: Team[] = [
    {
      id: 0,
      name: 'Команда новая',
      closed: false,
      createdAt: new Date(13, 10, 2023),
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      owner: users[0],
      leader: users[1],
      members: [...users],
      skills: [],
    },
    {
      id: 1,
      name: 'Команда новая',
      closed: false,
      createdAt: new Date(13, 10, 2023),
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      owner: users[1],
      leader: users[2],
      members: [users[3]],
      skills: [...skills],
    },
  ]

  const IdeasMarket: IdeasMarket[] = [
    {
      id: 1,
      position: 1,
      name: 'BaccaratHelper',
      initiator: 'Андрей Бырса',
      description:
        'Проект для казино, созданный при помощи искусственого интеллекта и предварительно считывающий выдаваемые карты при помощи математической статистики...',
      stack: [
        {
          id: 0,
          name: 'JavaScript',
          type: 'LANGUAGE',
          confirmed: true,
        },
      ],
      createdAt: new Date('10.01.2023'),
      maxTeamSize: 10,
      status: 'RECRUITMENT_IS_OPEN',
      requests: 111,
      acceptedRequests: 4,
      isFavorite: false,
    },
    {
      id: 2,
      position: 2,
      name: 'Vaccarat',
      initiator: 'Кирилл Власов',
      description:
        'Проект для казино, созданный при помощи искусственого интеллекта и предварительно считывающий выдаваемые карты при помощи математической статистики...........................',
      stack: [
        {
          id: 0,
          name: 'JavaScript',
          type: 'LANGUAGE',
          confirmed: true,
        },
      ],
      createdAt: new Date('10.01.2023'),
      maxTeamSize: 10,
      status: 'RECRUITMENT_IS_OPEN',
      requests: 222,
      acceptedRequests: 5,
      isFavorite: false,
    },
    {
      id: 3,
      position: 3,
      name: 'Insensible',
      initiator: 'Тимур Минязев',
      description:
        'Проект для казино, созданный при помощи искусственого интеллекта и предварительно считывающий выдаваемые карты при помощи математической статистики...',
      stack: [
        {
          id: 0,
          name: 'JavaScript',
          type: 'LANGUAGE',
          confirmed: true,
        },
      ],
      createdAt: new Date('10.01.2023'),
      maxTeamSize: 10,
      status: 'RECRUITMENT_IS_OPEN',
      requests: 0,
      acceptedRequests: 0,
      isFavorite: false,
    },
  ]

  return {
    users,
    usersEmails,
    teamMember,
    skills,
    usersGroups,
    comments,
    ratings,
    ideas,
    ideasSkills,
    teams,
    IdeasMarket,
  }
}

export default getMocks
