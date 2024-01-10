import { User } from '@Domain/User'
import { Profile } from '@Domain/Profile'
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
import { IdeaMarket, IdeaMarketAdvertisement } from '@Domain/IdeaMarket'
import { Market } from '@Domain/Market'
import { RequestTeamToIdea } from '@Domain/RequestTeamToIdea'
import { Project } from '@Domain/Project'

interface Mocks {
  users: User[]
  usersEmails: string[]
  profiles: Profile[]
  usersGroups: UsersGroup[]
  usersSkills: UsersSkills[]
  companies: Company[]
  market: Market[]
  skills: Skill[]
  ideas: Idea[]
  ideasSkills: IdeaSkills[]
  ideasMarket: IdeaMarket[]
  ideaMarketAdvertisements: IdeaMarketAdvertisement[]
  project: Project[]

  ratings: Rating[]
  comments: Comment[]
  teams: Team[]
  teamMembers: TeamMember[]
  teamInvitations: TeamInvitation[]
  requestsToTeam: RequestToTeam[]
  RequestTeams: RequestTeamToIdea[]
  teamSkills: TeamSkills[]
  notifications: Notification[]
}
function getMocks(): Mocks {
  const users: User[] = [
    {
      id: 'ffc1b25e-8a65-4cb2-8808-6eba443acec8',
      token: '10296538',
      email: 'kirill.vlasov.05@inbox.ru',
      firstName: 'Кирилл',
      lastName: 'Власов',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN', 'MEMBER'],
      createdAt: '2023-10-20T11:02:17Z',
    },
    {
      id: '1',
      token: '1',
      email: '1@mail.com',
      firstName: 'Иван',
      lastName: 'Иванович',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN', 'MEMBER'],
      createdAt: '2023-10-20T11:02:17Z',
    },
    {
      id: '2',
      token: '059182',
      email: '2@mail.com',
      firstName: 'Менеджер',
      lastName: 'Менеджер',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN', 'MEMBER'],
      createdAt: '2023-10-20T11:02:17Z',
    },
    {
      id: '3',
      token: '163097',
      email: '3@mail.com',
      firstName: 'Владелец',
      lastName: 'Владелец',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN', 'MEMBER'],
      createdAt: '2023-10-20T11:02:17Z',
    },
    {
      id: '4',
      token: '8755764',
      email: '4@mail.com',
      firstName: 'Винрит',
      lastName: 'Загрев',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN', 'MEMBER'],
      createdAt: '2023-10-20T11:02:17Z',
    },
    {
      id: '5',
      token: '836444',
      email: '5@mail.com',
      firstName: 'Версаль',
      lastName: 'Кустерман',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN', 'MEMBER'],
      createdAt: '2023-10-20T11:02:17Z',
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
  const teamMembers: TeamMember[] = [
    {
      id: '277922d4-e08a-430b-9b94-949dc32681b4',
      teamId: '1',
      userId: '1',
      email: 'timyr@mail.com',
      firstName: 'Тимур',
      lastName: 'Минязев',
      skills: [],
    },
    {
      id: 'ffc1b25e-8a65-4cb2-8808-6eba443acec8',
      teamId: '1',
      userId: '0',
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

  const teams: Team[] = [
    {
      id: '0',
      name: 'Визитка',
      closed: false,
      createdAt: '2023-10-20T11:02:17Z',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      membersCount: 4,
      owner: teamMembers[0],
      leader: teamMembers[0],
      members: [teamMembers[0], teamMembers[2], teamMembers[3]],
      skills: [skills[0], skills[4], skills[6], skills[9]],
      wantedSkills: [skills[0], skills[11], skills[16]],
      isRefused: false,
    },
    {
      id: '1',
      name: 'Кактус',
      closed: false,
      createdAt: '2023-10-20T11:02:17Z',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      membersCount: 4,
      owner: teamMembers[0],
      leader: teamMembers[0],
      members: [teamMembers[0], teamMembers[2], teamMembers[3]],
      skills: [skills[0], skills[4], skills[6], skills[9]],
      wantedSkills: [skills[0], skills[11], skills[16]],
      isRefused: false,
    },
    {
      id: '2',
      name: 'Карасики',
      closed: false,
      createdAt: '2023-10-20T11:02:17Z',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      membersCount: 4,
      owner: teamMembers[0],
      leader: teamMembers[0],
      members: [teamMembers[0], teamMembers[1], teamMembers[2], teamMembers[3]],
      skills: [skills[0], skills[4], skills[6], skills[9]],
      wantedSkills: [skills[0], skills[11], skills[16]],
      isRefused: false,
    },
  ]

  const ideasMarket: IdeaMarket[] = [
    {
      id: 'dfaedabe-2b3b-44e7-851e-35c9c6409869',
      initiator: {
        id: '1',
        email: 'barbakovom@tyuiu.ru',
        lastName: 'Барбаков',
        firstName: 'Олег',
      } as User,
      team: teams[0],
      marketId: '201',
      name: 'Цифровой помощник сотрудника приемной комиссии университета',
      problem: 'null',
      description: 'null',
      solution:
        'Разработать web приложение для прогнозирования предпочтительного направления обучения поступающих , прогноза успеваемости и успешности с применением технологий машинного обучения и искусственного интеллекта ',
      result: 'null',
      maxTeamSize: 7,
      customer: 'null',
      position: 7,
      stack: [
        {
          id: 'b629e3cb-c544-4b7c-8fa6-679df5fffc9c',
          name: 'Python',
          type: 'LANGUAGE',
          confirmed: true,
        },
        {
          id: '74d9f126-e188-4d1e-abb3-d494e5e5fa89',
          name: 'Keras',
          type: 'FRAMEWORK',
          confirmed: true,
        },
        {
          id: '2a03579d-9e40-4e85-a60e-6605a5a961dd',
          name: 'Scikit Learn',
          type: 'FRAMEWORK',
          confirmed: true,
        },
        {
          id: '5165bc7b-1495-4540-9517-2f1f4a54f273',
          name: 'PostgreSQL',
          type: 'DATABASE',
          confirmed: true,
        },
        {
          id: '0c0c65ee-aba3-4ba4-80ed-cf1ebe26da36',
          name: 'Docker',
          type: 'DEVOPS',
          confirmed: true,
        },
      ],
      status: 'RECRUITMENT_IS_OPEN',
      requests: 0,
      acceptedRequests: 0,
      isFavorite: false,
    },
    {
      id: '279b3fbf-de63-426f-bf9f-0c01ea19706b',
      initiator: {
        id: '2bafebe0-9514-43e0-badf-548388dfa2d4',
        email: 'warkingzar@gmail.com',
        lastName: 'Зайко',
        firstName: 'Антон',
      } as User,
      team: null,
      marketId: '201',
      name: 'PW Technology: Интерактивное виртуальное образование с 3D тренажерами',
      problem: 'null',
      description: 'null',
      solution:
        'Разработка проекта по обучению людей взаимодействию с оборудованием в игровой форме, где каждый пользователь сможет примерить на себя роль нефтяника, электрика, строителя и других профессий, требующих специальных навыков и знаний.\n',
      result: 'null',
      maxTeamSize: 7,
      customer: 'null',
      position: 8,
      stack: [
        {
          id: '31ea96a6-4da7-4618-a9f7-0f2531c35033',
          name: 'Unreal Engine GameMode',
          type: 'FRAMEWORK',
          confirmed: true,
        },
        {
          id: 'b74f4f1c-1d09-47b7-b8d0-e8d6e1ac95d5',
          name: 'Git',
          type: 'DEVOPS',
          confirmed: true,
        },
        {
          id: '15bc47fb-e894-4698-b86f-52be31fd7064',
          name: 'C++',
          type: 'LANGUAGE',
          confirmed: true,
        },
      ],
      status: 'RECRUITMENT_IS_OPEN',
      requests: 0,
      acceptedRequests: 0,
      isFavorite: false,
    },
    {
      id: 'c2d8b869-2731-4c37-b0de-17c1950a770f',
      initiator: {
        id: '09e6884f-65c5-4cd5-98f1-2f4ebb5823c0',
        email: 'l.a.nikiforova@tmn3.etagi.com',
        lastName: 'Никифорова',
        firstName: 'Любовь',
      } as User,
      team: null,
      marketId: '201',
      name: 'EMetrics.Viewer',
      problem: 'null',
      description: 'null',
      solution:
        'WEB-приложение (конкретная реализация выбирается разработчиками в рамках стэка React|Vue, NodeJS|Python)\nИспользование существующих у заказчика оперативных и аналитических БД в том числе тестовых.\nИспользование VPN (предоставляется заказчиком) для подключения к ресурсам заказчика с машин разработчиков.',
      result: 'null',
      maxTeamSize: 5,
      customer: 'null',
      position: 9,
      stack: [
        {
          id: 'b629e3cb-c544-4b7c-8fa6-679df5fffc9c',
          name: 'Python',
          type: 'LANGUAGE',
          confirmed: true,
        },
        {
          id: '0c0c65ee-aba3-4ba4-80ed-cf1ebe26da36',
          name: 'Docker',
          type: 'DEVOPS',
          confirmed: true,
        },
        {
          id: 'd908579e-4528-4268-bb7f-e072c5dc3f4d',
          name: 'GOLANG',
          type: 'LANGUAGE',
          confirmed: true,
        },
        {
          id: '8e22a7d8-4148-4c73-80dc-8834c51fe800',
          name: 'C#',
          type: 'LANGUAGE',
          confirmed: true,
        },
        {
          id: '743145bc-c8ac-460b-a908-fdf3269d52d9',
          name: 'Vue',
          type: 'FRAMEWORK',
          confirmed: true,
        },
        {
          id: 'b74f4f1c-1d09-47b7-b8d0-e8d6e1ac95d5',
          name: 'Git',
          type: 'DEVOPS',
          confirmed: true,
        },
        {
          id: 'ca34b1a6-c56e-40b4-b77d-454eb971b059',
          name: 'Redis',
          type: 'DATABASE',
          confirmed: true,
        },
        {
          id: '5165bc7b-1495-4540-9517-2f1f4a54f273',
          name: 'PostgreSQL',
          type: 'DATABASE',
          confirmed: true,
        },
      ],
      status: 'RECRUITMENT_IS_OPEN',
      requests: 0,
      acceptedRequests: 0,
      isFavorite: false,
    },
    {
      id: 'a51c17fd-c089-448c-be7b-714bceee8109',
      initiator: {
        id: '12c1534d-c6d1-4515-b531-ea380d75b772',
        email: 'd.shirokov@unlim.group',
        lastName: 'Широков',
        firstName: 'Дмитрий',
      } as User,
      team: null,
      marketId: '2',
      name: 'Расчет строительных материалов. ',
      problem: 'null',
      description: 'null',
      solution:
        'Система, которая позволяет указать размерные характеристики объекта строительства и\\или работ, выбрать требуемый материал и получить расчет количества этих материалов.\nПродумать систему придется в рамках реализации проекта.',
      result: 'null',
      maxTeamSize: 7,
      customer: 'null',
      position: 10,
      stack: [
        {
          id: 'b629e3cb-c544-4b7c-8fa6-679df5fffc9c',
          name: 'Python',
          type: 'LANGUAGE',
          confirmed: true,
        },
        {
          id: '0c0c65ee-aba3-4ba4-80ed-cf1ebe26da36',
          name: 'Docker',
          type: 'DEVOPS',
          confirmed: true,
        },
        {
          id: 'd908579e-4528-4268-bb7f-e072c5dc3f4d',
          name: 'GOLANG',
          type: 'LANGUAGE',
          confirmed: true,
        },
        {
          id: '8e22a7d8-4148-4c73-80dc-8834c51fe800',
          name: 'C#',
          type: 'LANGUAGE',
          confirmed: true,
        },
        {
          id: '743145bc-c8ac-460b-a908-fdf3269d52d9',
          name: 'Vue',
          type: 'FRAMEWORK',
          confirmed: true,
        },
        {
          id: 'b74f4f1c-1d09-47b7-b8d0-e8d6e1ac95d5',
          name: 'Git',
          type: 'DEVOPS',
          confirmed: true,
        },
        {
          id: 'ca34b1a6-c56e-40b4-b77d-454eb971b059',
          name: 'Redis',
          type: 'DATABASE',
          confirmed: true,
        },
        {
          id: '5165bc7b-1495-4540-9517-2f1f4a54f273',
          name: 'PostgreSQL',
          type: 'DATABASE',
          confirmed: true,
        },
      ],
      status: 'RECRUITMENT_IS_OPEN',
      requests: 0,
      acceptedRequests: 0,
      isFavorite: false,
    },
  ]

  const market: Market[] = [
    {
      id: '200',
      name: 'Летняя биржа 2023',
      startDate: '2023-10-25T11:02:17Z',
      finishDate: '2023-10-25T11:02:17Z',
      status: 'DONE',
    },
    {
      id: '201',
      name: 'Осенняя биржа 2023',
      startDate: '2023-10-25T11:02:17Z',
      finishDate: '2023-10-25T11:02:17Z',
      status: 'ACTIVE',
    },
    {
      id: '202',
      name: 'Зимняя биржа 2024',
      startDate: '2023-10-25T11:02:17Z',
      finishDate: '2023-10-25T11:02:17Z',
      status: 'NEW',
    },
    {
      id: '203',
      name: 'Весенняя биржа 2024',
      startDate: '2023-10-25T11:02:17Z',
      finishDate: '2023-10-25T11:02:17Z',
      status: 'NEW',
    },
  ]
  const usersEmails: string[] = users.map((user) => user.email)
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

  const ideaMarketAdvertisements: IdeaMarketAdvertisement[] = [
    {
      id: '0',
      ideaMarketId: ideasMarket[0].id,
      createdAt: '2023-03-11T11:02:17Z',

      text: 'Для выполнения данной идеи требуются только бекендеры!',
      sender: users[2],
      checkedBy: [users[2].email],
    },
    {
      id: '1',
      ideaMarketId: ideasMarket[0].id,
      createdAt: '2023-03-12T11:02:17Z',

      text: 'Скоро набор закроется, быстрее подавайте заявки!',
      sender: users[2],
      checkedBy: [users[2].email],
    },
    {
      id: '2',
      ideaMarketId: ideasMarket[1].id,
      createdAt: '2023-03-18T11:02:17Z',

      text: 'Требуются фронтендеры, бекендеры и желающие научиться новым компетенциям.',
      sender: users[0],
      checkedBy: [users[0].email],
    },
  ]

  const teamSkills: TeamSkills[] = [
    {
      teamId: '0',
      wantedSkills: [skills[0], skills[2]],
      skills: [],
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
      skills: [
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
      sender: users[0],
      text: 'Комментарий 1',
      checkedBy: [],
    },
    {
      id: '1',
      ideaId: '0',
      createdAt: '2023-10-21T11:02:17Z',
      sender: users[0],
      text: 'Комментарий 2',
      checkedBy: ['0', '1'],
    },
    {
      id: '2',
      ideaId: '1',
      createdAt: '2023-10-21T11:02:17Z',
      sender: users[0],
      text: 'Требуются Frontend разработчики!',
      checkedBy: [],
    },
    {
      id: '2',
      ideaId: '2',
      createdAt: '2023-10-21T11:02:17Z',
      sender: users[0],
      text: 'Скоро закроется набор!',
      checkedBy: [],
    },
  ]
  const ratings: Rating[] = [
    {
      id: '0',
      ideaId: '0',
      expertId: users[0].id,
      expertFirstName: users[0].firstName,
      expertLastName: users[0].lastName,
      budget: 1,
      technicalRealizability: null,
      suitability: 2,
      rating: 8 / 5,
      originality: 3,
      marketValue: 1,
      isConfirmed: false,
    },
    {
      id: '1',
      ideaId: '0',
      expertId: users[1].id,
      expertFirstName: users[1].firstName,
      expertLastName: users[1].lastName,
      budget: 2,
      technicalRealizability: 4,
      suitability: 5,
      rating: 14 / 5,
      originality: 1,
      marketValue: 2,
      isConfirmed: true,
    },
    {
      id: '2',
      ideaId: '1',
      expertId: users[0].id,
      expertFirstName: users[0].firstName,
      expertLastName: users[0].lastName,
      budget: 1,
      technicalRealizability: 1,
      suitability: 5,
      rating: null,
      originality: null,
      marketValue: null,
      isConfirmed: false,
    },
  ]
  const ideas: Idea[] = [
    {
      id: '0',
      initiator: users[0],
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
      isChecked: true,
      isActive: false,
    },
    {
      id: '1',
      initiator: users[1],
      name: 'Моя новая идея',
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
      status: 'ON_APPROVAL',
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
      isChecked: false,
      isActive: false,
    },
    {
      id: '2',
      initiator: users[2],
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
      isChecked: false,
      isActive: false,
    },
    {
      id: '3',
      initiator: users[0],
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
      isChecked: false,
      isActive: false,
    },
    {
      id: '7',
      isChecked: true,
      initiator: users[1],
      name: 'Земляника',
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
      isActive: false,
    },
    {
      id: '4',
      initiator: users[2],
      name: 'Зeмляника',
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
      status: 'ON_MARKET',
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
      isChecked: false,
      isActive: true,
    },
  ]

  const ideasSkills: IdeaSkills[] = [
    { ideaId: '0', skills: [...skills] },
    {
      ideaId: '1',
      skills: [skills[0], skills[2]],
    },
    {
      ideaId: '4',
      skills: [...skills],
    },
  ]

  const project: Project[] = [
    {
      id: '0',

      idea: ideas[1],
      initiator: users[1],
      team: teams[5],
      members: [
        {
          projectId: '0',
          projectName: 'Моя новая идея',
          teamId: '0',
          teamName: 'Визитка',
          userId: 'ffc1b25e-8a65-4cb2-8808-6eba443acec8',
          email: 'kirill.vlasov.05@inbox.ru',
          firstName: 'Кирилл',
          lastName: 'Власов',
          startDate: '2023-10-25T11:02:17Z',
          finishDate: '2023-10-25T11:02:17Z',
          role: 'DEVELOPER',
        },
      ],
      startDate: '2023-10-25T11:02:17Z',
      finisDate: '2023-10-25T11:02:17Z',
      status: 'DONE',
    },
    {
      id: '1',

      idea: ideas[1],
      initiator: users[1],
      team: teams[5],
      members: [
        {
          projectId: '1',
          projectName: 'Табуретка',
          teamId: '0',
          teamName: 'Визитка',
          userId: 'ffc1b25e-8a65-4cb2-8808-6eba443acec8',
          email: 'kirill.vlasov.05@inbox.ru',
          firstName: 'Кирилл',
          lastName: 'Власов',
          startDate: '2023-10-25T11:02:17Z',
          finishDate: '2023-10-25T11:02:17Z',
          role: 'DEVELOPER',
        },
      ],
      startDate: '2023-10-25T11:02:17Z',
      finisDate: '2023-10-25T11:02:17Z',
      status: 'DONE',
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
      teamsExperience: [
        {
          teamId: '0',
          teamName: 'Визитка',
          userId: 'ffc1b25e-8a65-4cb2-8808-6eba443acec8',
          firstName: 'Кирилл',
          lastName: 'Власов',
          startDate: '2023-10-25T11:02:17Z',
          finishDate: '2023-11-25T11:02:17Z',
          hasActiveProject: false,
        },
        {
          teamId: '2',
          teamName: 'Карасики',
          userId: 'ffc1b25e-8a65-4cb2-8808-6eba443acec8',
          firstName: 'Кирилл',
          lastName: 'Власов',
          startDate: '2023-11-25T11:02:17Z',
          finishDate: undefined,
          hasActiveProject: true,
        },
        {
          teamId: '1',
          teamName: 'Кактус',
          userId: 'ffc1b25e-8a65-4cb2-8808-6eba443acec8',
          firstName: 'Кирилл',
          lastName: 'Власов',
          startDate: '2023-09-25T11:02:17Z',
          finishDate: '2023-10-25T11:02:17Z',
          hasActiveProject: false,
        },
      ],
      teamsProjects: [
        {
          projectId: '0',
          projectName: 'Моя новая идея',
          teamId: '0',
          teamName: 'Визитка',
          userId: 'ffc1b25e-8a65-4cb2-8808-6eba443acec8',
          email: 'kirill.vlasov.05@inbox.ru',
          firstName: 'Кирилл',
          lastName: 'Власов',
          startDate: '2023-09-25T11:02:17Z',
          finishDate: '2023-09-25T11:02:17Z',
          role: 'DEVELOPER',
        },
        {
          projectId: '0',
          projectName: 'Табуретка',
          teamId: '0',
          teamName: 'Визитка',
          userId: 'ffc1b25e-8a65-4cb2-8808-6eba443acec8',
          email: 'kirill.vlasov.05@inbox.ru',
          firstName: 'Кирилл',
          lastName: 'Власов',
          startDate: '2023-09-25T11:02:17Z',
          finishDate: '2023-09-25T11:02:17Z',
          role: 'DEVELOPER',
        },
        {
          projectId: '0',
          projectName: 'Катер',
          teamId: '2',
          teamName: 'Карасики',
          userId: 'ffc1b25e-8a65-4cb2-8808-6eba443acec8',
          email: 'kirill.vlasov.05@inbox.ru',
          firstName: 'Кирилл',
          lastName: 'Власов',
          startDate: '2023-09-25T11:02:17Z',
          finishDate: undefined,
          role: 'DEVELOPER',
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
      link: null,
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
      link: null,
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
      link: null,
      isShowed: false,
      isReaded: true,
      isFavourite: true,
      createdAt: '2023-10-20T11:02:17Z',
    },
    {
      id: '3',
      userId: '2',
      title: 'Чат 2',
      message: 'Петров(менеджер, проект 2): дедлайн завтра',
      link: null,
      isShowed: true,
      isReaded: true,
      isFavourite: true,
      createdAt: '2023-10-30T11:02:17Z',
    },
  ]
  const RequestTeams: RequestTeamToIdea[] = [
    {
      id: '2',
      ideaMarketId: '2',
      marketId: '201',
      teamId: '0',
      status: 'NEW',
      name: 'Первые разрабы мира',
      membersCount: 4,
      skills: [
        skills[0],
        skills[4],
        skills[6],
        skills[7],
        skills[8],
        skills[11],
        skills[12],
        skills[17],
        skills[18],
      ],
      letter:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorbeatae ipsum dicta omnis adipisci magni autem eos quisquam doloresmaxime. Dignissimos cum nulla consequatur accusantium distinctioaut. Velit, assumenda porro!',
    },
    {
      id: '3',
      ideaMarketId: '3',
      marketId: '201',
      teamId: '0',
      status: 'NEW',

      name: 'Чемпионы',
      membersCount: 4,
      skills: [
        skills[0],
        skills[4],
        skills[6],
        skills[7],
        skills[8],
        skills[11],
        skills[12],
        skills[16],
      ],
      letter:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorbeatae ipsum dicta omnis adipisci magni autem eos quisquam doloresmaxime. Dignissimos cum nulla consequatur accusantium distinctioaut. Velit, assumenda porro!',
    },
    {
      id: '2',
      ideaMarketId: '1',
      marketId: '201',
      status: 'NEW',
      teamId: '2',
      name: 'Удальцы',
      membersCount: 4,
      skills: [
        skills[0],
        skills[2],
        skills[3],
        skills[4],
        skills[6],
        skills[7],
        skills[8],
        skills[9],
        skills[11],
      ],
      letter:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorbeatae ipsum dicta omnis adipisci magni autem eos quisquam doloresmaxime. Dignissimos cum nulla consequatur accusantium distinctioaut. Velit, assumenda porro!',
    },
    {
      id: '3',
      ideaMarketId: '1',
      marketId: '201',
      status: 'NEW',
      teamId: '3',
      name: 'Молодцы',
      membersCount: 4,
      skills: [
        skills[0],
        skills[2],
        skills[3],
        skills[4],
        skills[6],
        skills[7],
        skills[8],
        skills[9],
        skills[11],
      ],
      letter:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorbeatae ipsum dicta omnis adipisci magni autem eos quisquam doloresmaxime. Dignissimos cum nulla consequatur accusantium distinctioaut. Velit, assumenda porro!',
    },
    {
      id: '4',
      ideaMarketId: '2',
      marketId: '201',
      status: 'NEW',
      teamId: '4',
      name: 'Хорошая компания',
      membersCount: 4,
      skills: [
        skills[0],
        skills[2],
        skills[3],
        skills[4],
        skills[6],
        skills[7],
        skills[8],
        skills[9],
        skills[11],
      ],
      letter:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorbeatae ipsum dicta omnis adipisci magni autem eos quisquam doloresmaxime. Dignissimos cum nulla consequatur accusantium distinctioaut. Velit, assumenda porro!',
    },
    {
      id: '5',
      ideaMarketId: '2',
      marketId: '201',
      status: 'NEW',
      teamId: '5',
      name: 'Негатив',
      membersCount: 4,
      skills: [
        skills[0],
        skills[2],
        skills[3],
        skills[4],
        skills[6],
        skills[7],
        skills[8],
        skills[9],
        skills[11],
      ],
      letter:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorbeatae ipsum dicta omnis adipisci magni autem eos quisquam doloresmaxime. Dignissimos cum nulla consequatur accusantium distinctioaut. Velit, assumenda porro!',
    },
    {
      id: '6',
      ideaMarketId: '2',
      marketId: '201',
      status: 'NEW',
      teamId: '6',
      name: 'Позитив',
      membersCount: 4,
      skills: [
        skills[0],
        skills[2],
        skills[3],
        skills[4],
        skills[6],
        skills[7],
        skills[8],
        skills[9],
        skills[11],
      ],
      letter:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorbeatae ipsum dicta omnis adipisci magni autem eos quisquam doloresmaxime. Dignissimos cum nulla consequatur accusantium distinctioaut. Velit, assumenda porro!',
    },
    {
      id: '7',
      ideaMarketId: '2',
      marketId: '201',
      status: 'NEW',
      teamId: '13',
      name: 'Смешарики',
      membersCount: 4,
      skills: [
        skills[0],
        skills[2],
        skills[3],
        skills[4],
        skills[6],
        skills[7],
        skills[8],
        skills[9],
        skills[11],
      ],
      letter:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorbeatae ipsum dicta omnis adipisci magni autem eos quisquam doloresmaxime. Dignissimos cum nulla consequatur accusantium distinctioaut. Velit, assumenda porro!',
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
    market,
    skills,
    usersSkills,
    teamSkills,
    ideaMarketAdvertisements,
    usersGroups,
    companies,
    ideas,
    ideasSkills,
    ideasMarket,
    ratings,
    comments,
    project,

    teams,
    teamMembers,
    requestsToTeam,
    RequestTeams,
    teamInvitations,
    notifications,
  }
}
export default getMocks
