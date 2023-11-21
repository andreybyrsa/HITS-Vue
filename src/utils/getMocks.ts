import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'
import UsersGroup from '@Domain/UsersGroup'
import Comment from '@Domain/Comment'
import { Idea, IdeaSkills, Rating } from '@Domain/Idea'
import Team from '@Domain/Team'
import TeamMember from '@Domain/TeamMember'
import Project from '@Domain/Project'
import Notification from '@Domain/Notification'
import Profile from '@Domain/Profile'
import Company from '@Domain/Company'

interface Mocks {
  users: User[]
  usersEmails: string[]
  skills: Skill[]
  usersGroups: UsersGroup[]
  comments: Comment[]
  ideas: Idea[]
  ratings: Rating[]
  ideasSkills: IdeaSkills[]
  teams: Team[]
  profileSkills: Skill[]
  profileIdeas: Idea[]
  profileProjects: Project[]
  profileUser: User
  profile: Profile[]

  teamMember: TeamMember[]
  notifications: Notification[]
  companies: Company[]
}

function getMocks(): Mocks {
  const skills: Skill[] = [
    {
      id: '0',
      name: 'JavaScript',
      type: 'LANGUAGE',
      confirmed: true,
    },
    {
      id: '1',
      name: 'VueJS',
      type: 'FRAMEWORK',
      confirmed: true,
    },
    {
      id: '2',
      name: 'Java',
      type: 'LANGUAGE',
      confirmed: true,
    },
    {
      id: '3',
      name: 'C#',
      type: 'LANGUAGE',
      confirmed: true,
    },
    {
      id: '4',
      name: 'Vue Js',
      type: 'FRAMEWORK',
      confirmed: true,
    },
    {
      id: '5',
      name: 'mySQL',
      type: 'DATABASE',
      confirmed: true,
    },
    {
      id: '6',
      name: 'Docker',
      type: 'DEVOPS',
      confirmed: true,
    },
    {
      id: '7',
      name: 'PHP',
      type: 'LANGUAGE',
      confirmed: true,
    },
    {
      id: '8',
      name: 'Svelte',
      type: 'FRAMEWORK',
      confirmed: true,
    },
    {
      id: '9',
      name: 'Oracle',
      type: 'DATABASE',
      confirmed: true,
    },
    {
      id: '10',
      name: 'GitLab',
      type: 'DEVOPS',
      confirmed: true,
    },
    {
      id: '11',
      name: 'Rast',
      type: 'LANGUAGE',
      confirmed: true,
    },
    {
      id: '12',
      name: 'Angular',
      type: 'FRAMEWORK',
      confirmed: true,
    },
    {
      id: '13',
      name: 'Mongo',
      type: 'DATABASE',
      confirmed: true,
    },
    {
      id: '14',
      name: 'Git',
      type: 'DEVOPS',
      confirmed: true,
    },
    {
      id: '3',
      name: 'Docker',
      type: 'DEVOPS',
      confirmed: true,
    },
    {
      id: '4',
      name: 'MongoDB',
      type: 'DATABASE',
      confirmed: true,
    },
    {
      id: '5',
      name: 'MySQL',
      type: 'DATABASE',
      confirmed: true,
    },
    {
      id: '6',
      name: 'PostgreSQL',
      type: 'DATABASE',
      confirmed: true,
    },
    {
      id: '7',
      name: 'Python',
      type: 'LANGUAGE',
      confirmed: true,
    },
    {
      id: '8',
      name: 'Spring',
      type: 'FRAMEWORK',
      confirmed: true,
    },
    {
      id: '9',
      name: 'Django',
      type: 'FRAMEWORK',
      confirmed: true,
    },
    {
      id: '10',
      name: 'Git',
      type: 'DEVOPS',
      confirmed: true,
    },
    {
      id: '11',
      name: 'VSCode',
      type: 'DEVOPS',
      confirmed: true,
    },
  ]

  const users: User[] = [
    {
      id: '33',
      token: '10296538',
      email: 'andrey@mail.com',
      firstName: 'Андрей',
      lastName: 'Бырса',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
    },
    {
      id: '343',
      token: '613098',
      email: 'timyr@mail.com',
      firstName: 'Тимур',
      lastName: 'Минязев',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
    },
    {
      id: '3',
      token: '059182',
      email: 'kirill.vlasov.05@inbox.ru',
      firstName: 'Кирилл',
      lastName: 'Власов',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
    },
    {
      id: '345',
      token: '163097',
      email: 'maga@mail.com',
      firstName: 'Мамедага',
      lastName: 'Байрамов',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
    },
  ]

  const usersEmails: string[] = users.map((user) => user.email)

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

  const teamMember: TeamMember[] = [
    {
      email: 'andrey@mail.com',
      id: '33',
      firstName: 'Андрей',
      lastName: 'Бырса',
    },
    {
      email: 'timyr@mail.com',
      id: '343',
      firstName: 'Тимур',
      lastName: 'Минязев',
    },
    {
      email: 'kirill.vlasov.05@inbox.ru',
      id: '3',
      firstName: 'Кирилл',
      lastName: 'Власов',
    },
    {
      email: 'maga@mail.com',
      id: '345',
      firstName: 'Мамедага',
      lastName: 'Байрамов',
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
      rating: 3,
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

  const teams: Team[] = [
    {
      id: '0',
      name: 'Фронтендеры',
      closed: false,
      createdAt: '2023-10-20T11:02:17Z',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      membersCount: 4,
      owner: teamMember[0],
      leader: teamMember[1],
      members: [...teamMember],
      skills: [...skills],
    },
    {
      id: '1',
      name: 'Бэккендеры',
      closed: false,
      createdAt: '2023-10-20T11:02:17Z',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      membersCount: 3,
      owner: teamMember[2],
      leader: teamMember[2],
      members: [teamMember[3], teamMember[2]],
      skills: [...skills],
    },
    {
      id: '2',
      name: 'Мушкетеры',
      closed: false,
      createdAt: '2023-10-20T11:02:17Z',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      membersCount: 4,
      owner: teamMember[2],
      leader: teamMember[1],
      members: [teamMember[3], teamMember[1]],
      skills: [skills[0]],
    },
    {
      id: '3',
      name: 'Смешарики',
      closed: true,
      createdAt: '2023-10-20T11:02:17Z',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      membersCount: 4,
      owner: teamMember[2],
      leader: teamMember[1],
      members: [teamMember[3], teamMember[1]],
      skills: [skills[0]],
    },
  ]
  const profileUser: User = users[1]

  const profileSkills: Skill[] = [skills[0], skills[2], skills[6], skills[5]]

  const profileIdeas: Idea[] = [ideas[0], ideas[1]]

  const profileProjects: Project[] = [
    {
      id: 412,
      name: 'Поднятие уровня моря',
      description: 'Надо бы поднять уровень моря',
    },
    {
      id: 445,
      name: 'Еда экспресс',
      description: 'Технология эффективного питания',
    },
    {
      id: 733,
      name: 'Важный проект',
      description: 'Очень важный проект',
    },
  ]

  const profile: Profile[] = [
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
        skills[10],
        skills[11],
        skills[12],
        skills[13],
        skills[14],
      ],
      ideas: [ideas[0], ideas[1]],
      projects: [
        {
          id: 3565634,
          name: 'Деление на 0',
          description: 'Очень важно',
        },
        {
          id: 2434465,
          name: 'Спасение экосистемы',
          description: 'Технология эффективного спасения',
        },
        {
          id: 876544,
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
          id: 954543,
          name: 'Поднятие уровня моря',
          description: 'Надо бы поднять уровень моря',
        },
        {
          id: 346535,
          name: 'Еда экспресс',
          description: 'Технология эффективного питания',
        },
        {
          id: 975452,
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
    skills,
    usersGroups,
    comments,
    ratings,
    ideas,
    ideasSkills,
    teams,
    profileSkills,
    profileIdeas,
    profileProjects,
    profileUser,
    profile,
    teamMember,
    notifications,
    companies,
  }
}

export default getMocks
