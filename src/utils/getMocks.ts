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
import { IdeaMarket, IdeaMarketAdvertisement } from '@Domain/IdeaMarket'
import { Market } from '@Domain/Market'
import { RequestTeamToIdea } from '@Domain/RequestTeamToIdea'
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
  const market: Market[] = [
    {
      id: '0',
      name: 'Осенняя биржа',
      startDate: '2023-10-10T11:02:17Z',
      finishDate: '2023-10-25T11:02:17Z',
      status: 'DONE',
    },
    {
      id: '1',
      name: 'Зимняя биржа',
      startDate: '2023-10-12T11:02:17Z',
      finishDate: '2023-10-13T11:02:17Z',
      status: 'ACTIVE',
    },
    {
      id: '2',
      name: 'Весенняя биржа',
      startDate: '2023-10-13T11:02:17Z',
      finishDate: '2023-10-14T11:02:17Z',
      status: 'NEW',
    },
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
      skills: [skills[0], skills[4], skills[6], skills[9]],
      wantedSkills: [skills[0], skills[11], skills[16]],
      isRefused: false,
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
      skills: [skills[0], skills[4], skills[6], skills[9]],
      wantedSkills: [skills[0], skills[11], skills[16]],
      isRefused: false,
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
      skills: [skills[0], skills[4], skills[6], skills[9]],
      wantedSkills: [skills[0], skills[11], skills[16]],
      isRefused: false,
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
      skills: [skills[0], skills[4], skills[6], skills[9]],
      wantedSkills: [skills[0], skills[11], skills[16]],
      isRefused: false,
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
      skills: [skills[0], skills[4], skills[6], skills[9]],
      wantedSkills: [skills[0], skills[11], skills[16]],
      isRefused: false,
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
      isRefused: false,
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
      skills: [skills[0], skills[1], skills[11], skills[13], skills[16]],
      wantedSkills: [skills[2], skills[3], skills[8], skills[12]],
      isRefused: false,
    },
  ]
  const ideasMarket: IdeaMarket[] = [
    {
      id: '1',
      position: 1,
      name: 'Создать электрический самолет',
      initiator: users[2],
      problem:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      solution:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      result:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      description:
        'Проект для казино, созданный при помощи искусственого интеллекта и предварительно считывающий выдаваемые карты при помощи математической статистики...',
      team: null,
      stack: [
        skills[0],
        skills[2],
        skills[3],
        skills[6],
        skills[7],
        skills[8],
        skills[9],
        skills[11],
        skills[12],
        skills[14],
        skills[15],
        skills[16],
        skills[17],
        skills[18],
      ],
      customer: 'ВШЦТ',
      createdAt: '2023-10-21T11:02:17Z',
      maxTeamSize: 10,
      status: 'RECRUITMENT_IS_OPEN',
      requests: 111,
      acceptedRequests: 4,
      isFavorite: false,
      startDate: '2023-10-20T11:02:17Z',
      finishDate: '2024-01-20T11:02:17Z',
    },
    {
      id: '2',
      position: 2,
      name: 'Создать машину времени',
      initiator: users[0],
      problem:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      solution:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      result:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      description:
        'Проект для казино, созданный при помощи искусственого интеллекта и предварительно считывающий выдаваемые карты при помощи математической статистики................',
      team: teams[0],
      stack: [
        skills[0],
        skills[2],
        skills[3],
        skills[6],
        skills[7],
        skills[8],
        skills[9],
        skills[11],
        skills[12],
        skills[14],
        skills[15],
        skills[16],
        skills[17],
        skills[18],
      ],
      customer: 'ВШЦТ',
      createdAt: '2023-10-21T11:02:17Z',
      maxTeamSize: 10,
      status: 'RECRUITMENT_IS_OPEN',
      requests: 222,
      acceptedRequests: 5,
      isFavorite: false,
      startDate: '2023-10-20T11:02:17Z',
      finishDate: '2024-01-20T11:02:17Z',
    },
    {
      id: '3',
      position: 3,
      name: 'Создать киборга',
      initiator: users[1],
      problem:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      solution:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      result:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      description:
        'Проект для казино, созданный при помощи искусственого интеллекта и предварительно считывающий выдаваемые карты при помощи математической статистики...',
      team: teams[1],
      stack: [skills[1], skills[2], skills[4], skills[9], skills[10]],
      customer: 'ВШЦТ',
      createdAt: '2023-10-21T11:02:17Z',
      maxTeamSize: 10,
      status: 'RECRUITMENT_IS_OPEN',
      requests: 0,
      acceptedRequests: 0,
      isFavorite: false,
      startDate: '2023-10-20T11:02:17Z',
      finishDate: '2024-01-20T11:02:17Z',
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
      checkedBy: [users[0].email],
    },
    {
      id: '1',
      initiatorEmail: '1@mail.com',
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
      checkedBy: [users[0].email],
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
      checkedBy: [users[0].email],
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
      checkedBy: [users[0].email],
    },
    {
      id: '4',
      initiatorEmail: '3@mail.com',
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
      checkedBy: [users[0].email],
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
  const RequestTeams: RequestTeamToIdea[] = [
    {
      id: '0',
      ideaMarketId: '1',
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
      id: '1',
      ideaMarketId: '1',
      status: 'NEW',
      teamId: '1',
      name: 'Программисты из apple',
      membersCount: 4,
      skills: [
        skills[3],
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
    teams,
    teamMembers,
    requestsToTeam,
    RequestTeams,
    teamInvitations,
    notifications,
  }
}
export default getMocks
