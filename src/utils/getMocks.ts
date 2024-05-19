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
  courseEnum,
  Team,
  TeamExperience,
  TeamInvitation,
  TeamMember,
  TeamSkills,
  TeamTags,
} from '@Domain/Team'
import Notification from '@Domain/Notification'
import { IdeaMarket, IdeaMarketAdvertisement } from '@Domain/IdeaMarket'
import { Market } from '@Domain/Market'
import { RequestTeamToIdea } from '@Domain/RequestTeamToIdea'
import { Project, ProjectMember } from '@Domain/Project'
import { InvitationTeamToIdea } from '@Domain/InvitationTeamToIdea'
import {
  Indicator,
  Quest,
  QuestTemplate,
  QuestTemplateShort,
  QuestResult,
  QuestStat as QuestCollapseData,
  TeamQuestStat as MembersCollapseData,
  UsersQuestStat,
  IndicatorCategory,
} from '@Domain/Quest'
import TeamMembers from '@Components/Modals/TeamModal/TeamMembers.vue'

export const usersMocks: User[] = [
  {
    id: 'ffc1b25e-8a65-4cb2-8808-6eba443acec8',
    token: '10296538',
    email: 'kirill.vlasov.05@inbox.ru',
    firstName: 'Кирилл',
    lastName: 'Власов',
    roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN', 'MEMBER'],
    createdAt: '2023-10-20T11:02:17Z',
    telephone: '1111111111',
    studyGroup: 'AAAA-22-1',
  },
  {
    id: '1',
    token: '1',
    email: '1@mail.com',
    firstName: 'Иван',
    lastName: 'Иванович',
    roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN', 'MEMBER'],
    createdAt: '2023-10-20T11:02:17Z',
    telephone: '22222222222',
    studyGroup: 'BBBB-22-1',
  },
  {
    id: '2',
    token: '059182',
    email: '2@mail.com',
    firstName: 'Менеджер',
    lastName: 'Менеджер',
    roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN', 'MEMBER'],
    createdAt: '2023-10-20T11:02:17Z',
    telephone: '33333333333',
    studyGroup: 'CCCC-22-1',
  },
  {
    id: '3',
    token: '163097',
    email: '3@mail.com',
    firstName: 'Владелец',
    lastName: 'Владелец',
    roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN', 'MEMBER'],
    createdAt: '2023-10-20T11:02:17Z',
    telephone: '44444444444',
    studyGroup: 'DDDD-22-1',
  },
  {
    id: '4',
    token: '8755764',
    email: '4@mail.com',
    firstName: 'Винрит',
    lastName: 'Загрев',
    roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN', 'MEMBER'],
    createdAt: '2023-10-20T11:02:17Z',
    telephone: '55555555555',
    studyGroup: 'EEEE-22-1',
  },
  {
    id: '5',
    token: '836444',
    email: '5@mail.com',
    firstName: 'Версаль',
    lastName: 'Кустерман',
    roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN', 'MEMBER'],
    createdAt: '2023-10-20T11:02:17Z',
    telephone: '66666666666',
    studyGroup: 'FFFF-22-1',
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

export const skillsMocks: Skill[] = [
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

export const teamMembersMocks: TeamMember[] = [
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

export const teamTagsMocks: TeamTags[] = [
  {
    studyGroups: ['ИИП-22-1', 'ИСТНб-21'],
    studyCourses: [courseEnum.first, courseEnum.second],
  },
  {
    studyGroups: ['ИИПб-23-1', 'АСОИУ-22-1'],
    studyCourses: [courseEnum.second],
  },
  {
    studyGroups: ['ИСТНб-21-2', 'АСОИУ-20-1'],
    studyCourses: [courseEnum.third, courseEnum.fourth],
  },
]

export const teamsMocks: Team[] = [
  {
    id: '1',
    name: 'Визитка',
    closed: true,
    createdAt: '2023-10-20T11:02:17Z',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
    membersCount: 2,
    owner: teamMembersMocks[1],
    leader: teamMembersMocks[1],
    members: [
      teamMembersMocks[0],
      teamMembersMocks[1],
      teamMembersMocks[2],
      teamMembersMocks[3],
    ],
    skills: [skillsMocks[0], skillsMocks[4], skillsMocks[6], skillsMocks[9]],
    tags: teamTagsMocks[0],
    wantedSkills: [skillsMocks[0], skillsMocks[11], skillsMocks[16]],
    isRefused: false,
    hasActiveProject: true,
    StatusQuest: false,
  },
  {
    id: '2',
    name: 'Кактус',
    closed: false,
    createdAt: '2023-10-30T11:02:17Z',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
    membersCount: 5,
    owner: teamMembersMocks[0],
    leader: teamMembersMocks[0],
    members: [teamMembersMocks[0], teamMembersMocks[2], teamMembersMocks[3]],
    skills: [skillsMocks[0], skillsMocks[4], skillsMocks[6], skillsMocks[9]],

    tags: teamTagsMocks[1],

    wantedSkills: [skillsMocks[0], skillsMocks[11], skillsMocks[16]],
    isRefused: false,
    hasActiveProject: false,
    StatusQuest: true,
  },
  {
    id: '3',
    name: 'Карасики',
    closed: false,
    createdAt: '2023-10-10T11:02:17Z',
    description:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
    membersCount: 6,
    owner: teamMembersMocks[0],
    leader: teamMembersMocks[0],
    members: [teamMembersMocks[0], teamMembersMocks[2], teamMembersMocks[3]],
    skills: [skillsMocks[0], skillsMocks[4], skillsMocks[6], skillsMocks[9]],

    tags: teamTagsMocks[2],

    wantedSkills: [skillsMocks[0], skillsMocks[11], skillsMocks[16]],
    isRefused: false,
    hasActiveProject: false,
    StatusQuest: false,
  },
]

export const ideasMarketMocks: IdeaMarket[] = [
  {
    id: 'dfaedabe-2b3b-44e7-851e-35c9c6409869',
    ideaId: 'dfaedabe-2b3b-44e7-851e-35c9c6409869',
    initiator: usersMocks[0],
    team: null,
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
    ideaId: '279b3fbf-de63-426f-bf9f-0c01ea19706b',
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
    ideaId: 'c2d8b869-2731-4c37-b0de-17c1950a770f',
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
    ideaId: 'a51c17fd-c089-448c-be7b-714bceee8109',
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
  {
    id: 'hfdnmkdfg-45678ejhdf-dhfc383-3456787654',
    ideaId: 'a51c17fd-c089-448c-be7b-714bceee8109',
    initiator: usersMocks[0],
    team: null,
    marketId: '201',
    name: 'Идея для проверки',
    problem: 'null',
    description:
      'Разработать web приложение для прогнозирования предпочтительного направления обучения поступающих , прогноза успеваемости и успешности с применением технологий машинного обучения и искусственного интеллекта',
    solution:
      'Разработать web приложение для прогнозирования предпочтительного направления обучения поступающих , прогноза успеваемости и успешности с применением технологий машинного обучения и искусственного интеллекта',
    result: 'null',
    maxTeamSize: 7,
    customer: 'ВШЦТ',
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
]

export const marketMocks: Market[] = [
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

export const usersEmailsMocks: string[] = usersMocks.map((user) => user.email)

export const usersSkillsMocks: UsersSkills[] = [
  {
    idUsers: '0',
    skills: [skillsMocks[0], skillsMocks[4], skillsMocks[6], skillsMocks[9]],
  },
  {
    idUsers: '1',
    skills: [skillsMocks[1], skillsMocks[2], skillsMocks[7], skillsMocks[19]],
  },
  {
    idUsers: '2',
    skills: [skillsMocks[0], skillsMocks[1], skillsMocks[9], skillsMocks[19]],
  },
  {
    idUsers: '3',
    skills: [skillsMocks[1], skillsMocks[5], skillsMocks[6], skillsMocks[17]],
  },
  {
    idUsers: '4',
    skills: [skillsMocks[1], skillsMocks[2], skillsMocks[3], skillsMocks[16]],
  },
  {
    idUsers: '5',
    skills: [skillsMocks[0], skillsMocks[2], skillsMocks[7], skillsMocks[15]],
  },
  {
    idUsers: '6',
    skills: [skillsMocks[2], skillsMocks[2], skillsMocks[7], skillsMocks[11]],
  },
]

export const ideaMarketAdvertisementsMocks: IdeaMarketAdvertisement[] = [
  {
    id: '0',
    ideaMarketId: ideasMarketMocks[0].id,
    createdAt: '2023-03-11T11:02:17Z',

    text: 'Для выполнения данной идеи требуются только бекендеры!',
    sender: usersMocks[2],
    checkedBy: [usersMocks[2].email],
  },
  {
    id: '1',
    ideaMarketId: ideasMarketMocks[0].id,
    createdAt: '2023-03-12T11:02:17Z',

    text: 'Скоро набор закроется, быстрее подавайте заявки!',
    sender: usersMocks[2],
    checkedBy: [usersMocks[2].email],
  },
  {
    id: '2',
    ideaMarketId: ideasMarketMocks[1].id,
    createdAt: '2023-03-18T11:02:17Z',

    text: 'Требуются фронтендеры, бекендеры и желающие научиться новым компетенциям.',
    sender: usersMocks[0],
    checkedBy: [usersMocks[0].email],
  },
]

export const teamSkillsMocks: TeamSkills[] = [
  {
    teamId: '0',
    wantedSkills: [skillsMocks[0], skillsMocks[2]],
    skills: [],
  },
  {
    teamId: '1',
    wantedSkills: [
      skillsMocks[0],
      skillsMocks[1],
      skillsMocks[5],
      skillsMocks[8],
      skillsMocks[9],
      skillsMocks[10],
      skillsMocks[18],
      skillsMocks[17],
      skillsMocks[16],
      skillsMocks[15],
      skillsMocks[11],
      skillsMocks[12],
      skillsMocks[13],
    ],
    skills: [
      skillsMocks[0],
      skillsMocks[1],
      skillsMocks[7],
      skillsMocks[8],
      skillsMocks[9],
      skillsMocks[11],
      skillsMocks[12],
      skillsMocks[13],
      skillsMocks[16],
      skillsMocks[17],
      skillsMocks[18],
      skillsMocks[19],
    ],
  },
]

export const teamInvitationsMocks: TeamInvitation[] = [
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

export const requestsToTeamMocks: RequestToTeam[] = [
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

export const usersGroupsMocks: UsersGroup[] = [
  {
    id: '0',
    name: 'Группа разработчиков',
    users: [...usersMocks],
    roles: ['INITIATOR'],
  },
  {
    id: '1',
    name: 'Группа экспертов',
    users: [],
    roles: ['ADMIN', 'EXPERT'],
  },
]

export const commentsMocks: Comment[] = [
  {
    id: '0',
    ideaId: '0',
    createdAt: '2023-10-20T11:02:17Z',
    sender: usersMocks[0],
    text: 'Комментарий 1',
    checkedBy: [],
  },
  {
    id: '1',
    ideaId: '0',
    createdAt: '2023-10-21T11:02:17Z',
    sender: usersMocks[0],
    text: 'Комментарий 2',
    checkedBy: ['0', '1'],
  },
  {
    id: '2',
    ideaId: '1',
    createdAt: '2023-10-21T11:02:17Z',
    sender: usersMocks[0],
    text: 'Требуются Frontend разработчики!',
    checkedBy: [],
  },
  {
    id: '2',
    ideaId: '2',
    createdAt: '2023-10-21T11:02:17Z',
    sender: usersMocks[0],
    text: 'Скоро закроется набор!',
    checkedBy: [],
  },
]

export const ratingsMocks: Rating[] = [
  {
    id: '0',
    ideaId: '0',
    expertId: usersMocks[0].id,
    expertFirstName: usersMocks[0].firstName,
    expertLastName: usersMocks[0].lastName,
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
    expertId: usersMocks[1].id,
    expertFirstName: usersMocks[1].firstName,
    expertLastName: usersMocks[1].lastName,
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
    expertId: usersMocks[0].id,
    expertFirstName: usersMocks[0].firstName,
    expertLastName: usersMocks[0].lastName,
    budget: 1,
    technicalRealizability: 1,
    suitability: 5,
    rating: null,
    originality: null,
    marketValue: null,
    isConfirmed: false,
  },
]

export const ideasMocks: Idea[] = [
  {
    id: '0',
    initiator: usersMocks[0],
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
    initiator: usersMocks[1],
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
    initiator: usersMocks[2],
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
    initiator: usersMocks[0],
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
    initiator: usersMocks[1],
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
    initiator: usersMocks[2],
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

export const ideasSkillsMocks: IdeaSkills[] = [
  { ideaId: '0', skills: [...skillsMocks] },
  {
    ideaId: '1',
    skills: [skillsMocks[0], skillsMocks[2]],
  },
  {
    ideaId: '4',
    skills: [...skillsMocks],
  },
]

export const projectMocks: Project[] = [
  {
    id: '0',

    idea: ideasMocks[1],
    initiator: usersMocks[1],
    team: teamsMocks[5],
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

    idea: ideasMocks[1],
    initiator: usersMocks[1],
    team: teamsMocks[5],
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

export const notificationsMocks: Notification[] = [
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

export const RequestTeamsMocks: RequestTeamToIdea[] = [
  {
    id: '2',
    ideaMarketId: '2',
    marketId: '201',
    teamId: '0',
    status: 'NEW',
    name: 'Первые разрабы мира',
    membersCount: 4,
    skills: [
      skillsMocks[0],
      skillsMocks[4],
      skillsMocks[6],
      skillsMocks[7],
      skillsMocks[8],
      skillsMocks[11],
      skillsMocks[12],
      skillsMocks[17],
      skillsMocks[18],
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
      skillsMocks[0],
      skillsMocks[4],
      skillsMocks[6],
      skillsMocks[7],
      skillsMocks[8],
      skillsMocks[11],
      skillsMocks[12],
      skillsMocks[16],
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
      skillsMocks[0],
      skillsMocks[2],
      skillsMocks[3],
      skillsMocks[4],
      skillsMocks[6],
      skillsMocks[7],
      skillsMocks[8],
      skillsMocks[9],
      skillsMocks[11],
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
      skillsMocks[0],
      skillsMocks[2],
      skillsMocks[3],
      skillsMocks[4],
      skillsMocks[6],
      skillsMocks[7],
      skillsMocks[8],
      skillsMocks[9],
      skillsMocks[11],
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
      skillsMocks[0],
      skillsMocks[2],
      skillsMocks[3],
      skillsMocks[4],
      skillsMocks[6],
      skillsMocks[7],
      skillsMocks[8],
      skillsMocks[9],
      skillsMocks[11],
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
      skillsMocks[0],
      skillsMocks[2],
      skillsMocks[3],
      skillsMocks[4],
      skillsMocks[6],
      skillsMocks[7],
      skillsMocks[8],
      skillsMocks[9],
      skillsMocks[11],
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
      skillsMocks[0],
      skillsMocks[2],
      skillsMocks[3],
      skillsMocks[4],
      skillsMocks[6],
      skillsMocks[7],
      skillsMocks[8],
      skillsMocks[9],
      skillsMocks[11],
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
      skillsMocks[0],
      skillsMocks[2],
      skillsMocks[3],
      skillsMocks[4],
      skillsMocks[6],
      skillsMocks[7],
      skillsMocks[8],
      skillsMocks[9],
      skillsMocks[11],
    ],
    letter:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorbeatae ipsum dicta omnis adipisci magni autem eos quisquam doloresmaxime. Dignissimos cum nulla consequatur accusantium distinctioaut. Velit, assumenda porro!',
  },
]

export const companiesMocks: Company[] = [
  {
    id: '0',
    name: 'ВШЦТ',
    owner: usersMocks[1],
    users: [usersMocks[2]],
  },
  {
    id: '1',
    name: 'Газпром',
    owner: usersMocks[1],
    users: [usersMocks[1]],
  },
  {
    id: '2',
    name: 'Роснефть',
    owner: usersMocks[2],
    users: [usersMocks[1]],
  },
]

export const teamsExperienceMocks: TeamExperience[] = [
  {
    teamId: teamsMocks[0].id,
    teamName: teamsMocks[0].name,
    userId: usersMocks[0].id,
    firstName: usersMocks[0].firstName,
    lastName: usersMocks[0].lastName,
    startDate: '2023-01-01T11:02:17Z',
    finishDate: null,
    hasActiveProject: teamsMocks[0].hasActiveProject,
  },
]

export const teamsProjectsMocks: ProjectMember[] = [
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
    finishDate: null,
    role: 'DEVELOPER',
  },
]

export const profilesMocks: Profile[] = [
  {
    ...usersMocks[0],
    skills: [...skillsMocks],
    ideas: [ideasMocks[0], ideasMocks[1]],
    teams: teamsExperienceMocks,
  },
]

export const invitationTeamToIdeaMocks: InvitationTeamToIdea[] = [
  {
    ideaId: ideasMarketMocks[0].id,
    ideaName: ideasMarketMocks[0].name,
    status: 'NEW',
    teamId: teamsMocks[0].id,
    initiatorId: ideasMarketMocks[0].initiator.id,
    id: '245vs-d52ff-d4sd-2s',
    teamName: teamsMocks[0].name,
    teamMembersCount: teamsMocks[0].membersCount,
    skills: ideasMarketMocks[0].stack,
  },
  {
    ideaId: ideasMarketMocks[1].id,
    ideaName: ideasMarketMocks[1].name,
    status: 'NEW',
    teamId: teamsMocks[1].id,
    initiatorId: ideasMarketMocks[1].initiator.id,
    id: '245vs-d52ff-d4sd-2s1',
    teamName: teamsMocks[1].name,
    teamMembersCount: teamsMocks[1].membersCount,
    skills: ideasMarketMocks[1].stack,
  },
]

export const questsShortMocks: QuestTemplateShort[] = [
  {
    idQuestTemplate: '1',
    available: true,
    name: 'Опрос компетенций',
  },
]

export const indicatorCategories: IndicatorCategory[] = [
  { id: '1', name: 'soft' },
  { id: '2', name: 'hard' },
]

export const indicatorsMocks: Indicator[] = [
  {
    idIndicator: '1',
    name: 'Как вам отношения в команде?',
    answers: ['Хорошо', 'Не очень'],
    type: 'TEAM',
    role: 'MEMBER',
    idCategory: indicatorCategories[0].id,
    categoryName: indicatorCategories[0].name,
    visible: true,
  },
  {
    idIndicator: '2',
    name: 'Как вам профессионализм команды?',
    answers: ['Хорошо', 'Не очень'],
    type: 'TEAM',
    role: 'MEMBER',
    idCategory: indicatorCategories[0].id,
    categoryName: indicatorCategories[0].name,
    visible: true,
  },
  {
    idIndicator: '3',
    name: 'Каков ваш взгляд на коммуникацию с этим членом команды?',
    answers: ['Хорошо', 'Не очень'],
    type: 'TEAM-MEMBER',
    role: 'MEMBER',
    idCategory: indicatorCategories[0].id,
    categoryName: indicatorCategories[0].name,
    visible: true,
  },
  {
    idIndicator: '4',
    name: 'Как оцениваете общение в команде?',
    answers: ['Хорошо', 'Не очень'],
    type: 'TEAM',
    role: 'MEMBER',
    idCategory: indicatorCategories[0].id,
    categoryName: indicatorCategories[0].name,
    visible: true,
  },
  {
    idIndicator: '5',
    name: 'Какие ваши мысли о навыках команды?',
    answers: ['Хорошо', 'Не очень'],
    type: 'TEAM',
    role: 'MEMBER',
    idCategory: indicatorCategories[0].id,
    categoryName: indicatorCategories[0].name,
    visible: true,
  },
  {
    idIndicator: '6',
    name: 'Как оценить атмосферу в коллективе?',
    answers: ['Хорошо', 'Не очень'],
    type: 'TEAM',
    role: 'MEMBER',
    idCategory: indicatorCategories[0].id,
    categoryName: indicatorCategories[0].name,
    visible: true,
  },
  {
    idIndicator: '7',
    name: 'Что вы думаете о взаимодействии с этим коллегой?',
    answers: ['Хорошо', 'Не очень'],
    type: 'TEAM-MEMBER',
    role: 'MEMBER',
    idCategory: indicatorCategories[0].id,
    categoryName: indicatorCategories[0].name,
    visible: true,
  },
  {
    idIndicator: '8',
    name: 'Ваше мнение о компетентности команды?',
    answers: ['Хорошо', 'Не очень'],
    type: 'TEAM',
    role: 'MEMBER',
    idCategory: indicatorCategories[0].id,
    categoryName: indicatorCategories[0].name,
    visible: true,
  },
  {
    idIndicator: '9',
    name: 'Что вы думаете о взаимодействии внутри группы?',
    answers: ['Хорошо', 'Не очень'],
    type: 'TEAM-MEMBER',
    role: 'MEMBER',
    idCategory: indicatorCategories[0].id,
    categoryName: indicatorCategories[0].name,
    visible: true,
  },
  {
    idIndicator: '10',
    name: 'Как воспринимаете атмосферу в команде?',
    answers: ['Хорошо', 'Не очень'],
    type: 'TEAM',
    role: 'MEMBER',
    idCategory: indicatorCategories[0].id,
    categoryName: indicatorCategories[0].name,
    visible: true,
  },
  {
    idIndicator: '11',
    name: 'Как вы оцениваете профессионализм коллег?',
    answers: ['Хорошо', 'Не очень'],
    type: 'TEAM',
    role: 'MEMBER',
    idCategory: indicatorCategories[0].id,
    categoryName: indicatorCategories[0].name,
    visible: true,
  },
  {
    idIndicator: '12',
    name: 'Ваш взгляд на взаимодействие с коллегами?',
    answers: ['Хорошо', 'Не очень'],
    type: 'TEAM-MEMBER',
    role: 'MEMBER',
    idCategory: indicatorCategories[0].id,
    categoryName: indicatorCategories[0].name,
    visible: true,
  },
  {
    idIndicator: '13',
    name: 'Что вы думаете о внутренних отношениях в команде?',
    answers: ['Хорошо', 'Не очень'],
    type: 'TEAM',
    role: 'MEMBER',
    idCategory: indicatorCategories[0].id,
    categoryName: indicatorCategories[0].name,
    visible: true,
  },
  {
    idIndicator: '14',
    name: 'Как вы оцениваете профессиональные навыки команды?',
    answers: ['Хорошо', 'Не очень'],
    type: 'TEAM',
    role: 'MEMBER',
    idCategory: indicatorCategories[0].id,
    categoryName: indicatorCategories[0].name,
    visible: true,
  },
  {
    idIndicator: '15',
    name: 'Ваше мнение о взаимодействии с коллегами?',
    answers: ['Хорошо', 'Не очень'],
    type: 'TEAM-MEMBER',
    role: 'MEMBER',
    idCategory: indicatorCategories[0].id,
    categoryName: indicatorCategories[0].name,
    visible: true,
  },
  {
    idIndicator: '16',
    name: 'Что вы думаете о взаимодействии в команде?',
    answers: ['Хорошо', 'Не очень'],
    type: 'TEAM-MEMBER',
    role: 'MEMBER',
    idCategory: indicatorCategories[0].id,
    categoryName: indicatorCategories[0].name,
    visible: true,
  },
  {
    idIndicator: '17',
    name: 'Как вы оцениваете атмосферу в команде?',
    answers: ['Хорошо', 'Не очень'],
    type: 'TEAM',
    role: 'MEMBER',
    idCategory: indicatorCategories[0].id,
    categoryName: indicatorCategories[0].name,
    visible: true,
  },
  {
    idIndicator: '18',
    name: 'Что вы думаете о профессионализме команды?',
    answers: ['Хорошо', 'Не очень'],
    type: 'TEAM',
    role: 'MEMBER',
    idCategory: indicatorCategories[0].id,
    categoryName: indicatorCategories[0].name,
    visible: true,
  },
  {
    idIndicator: '19',
    name: 'Ваш взгляд на взаимодействие с коллегой?',
    answers: ['Хорошо', 'Не очень'],
    type: 'TEAM-MEMBER',
    role: 'MEMBER',
    idCategory: indicatorCategories[0].id,
    categoryName: indicatorCategories[0].name,
    visible: true,
  },
]

export const QuestsTemplateMocks: QuestTemplate[] = [
  {
    idQuestTemplate: questsShortMocks[0].idQuestTemplate,
    available: questsShortMocks[0].available,
    name: questsShortMocks[0].name,
    description: 'Весенний опрос 2024 посвящен весне и птичкам',
    indicators: indicatorsMocks.slice(0, 7),
  },
]

export const QuestsMocks: Quest[] = [
  {
    idQuest: '4',
    idQuestTemplate: QuestsTemplateMocks[0].idQuestTemplate!,
    idTeams: [
      { id: teamsMocks[0].id },
      { id: teamsMocks[1].id },
      { id: teamsMocks[2].id },
    ],
    name: 'Весенний опрос 2024',
    startAt: '28.04.2024',
    endAt: '28.05.2024',
    available: true,
    percent: '22',
    // '1 / ' + teamsMocks[0].membersCount.toString(),
    passed: false,
  },
  {
    idQuest: '3',
    idQuestTemplate: QuestsTemplateMocks[0].idQuestTemplate!,
    idTeams: [{ id: teamsMocks[0].id }],
    name: 'Осенний опрос 2023',
    startAt: '28.11.2023',
    endAt: '28.12.2023',
    available: true,
    percent: '77',
    // Math.floor(teamsMocks[0].membersCount / 2).toString() +
    // ' / ' +
    // teamsMocks[0].membersCount.toString(),
    passed: true,
  },
  {
    idQuest: '2',
    idQuestTemplate: QuestsTemplateMocks[0].idQuestTemplate!,
    idTeams: [{ id: teamsMocks[0].id }],
    name: 'Весенний опрос 2023',
    startAt: '28.04.2023',
    endAt: '28.05.2023',
    available: true,
    percent: '65',
    // Math.floor(teamsMocks[0].membersCount / 2).toString() +
    // ' / ' +
    // teamsMocks[0].membersCount.toString(),
    passed: true,
  },
  {
    idQuest: '1',
    idQuestTemplate: QuestsTemplateMocks[0].idQuestTemplate!,
    idTeams: [{ id: teamsMocks[0].id }],
    name: 'Осенний опрос 2022',
    startAt: '28.11.2022',
    endAt: '28.12.2022',
    available: false,
    percent: '50',
    // Math.floor(teamsMocks[0].membersCount / 2).toString() +
    // ' / ' +
    // teamsMocks[0].membersCount.toString(),
    passed: false,
  },
]

export const resultsMocks: QuestResult[] = [
  {
    idResult: '8',
    idIndicator: indicatorsMocks[0].idIndicator,
    idQuest: QuestsMocks[0].idQuest,
    idFromUser: usersMocks[0].id,
    value: '4',
  },
  {
    idResult: '7',
    idIndicator: indicatorsMocks[1].idIndicator,
    idQuest: QuestsMocks[0].idQuest,
    idFromUser: usersMocks[0].id,
    idToUser: '',
    value: '',
  },
  ...teamsMocks[0].members.map((member): QuestResult => {
    return {
      idResult: '33' + member.userId,
      idIndicator: indicatorsMocks[2].idIndicator,
      idQuest: QuestsMocks[0].idQuest,
      idFromUser: usersMocks[0].id,
      idToUser: member.userId,
      value: '',
    }
  }),
  {
    idResult: '4',
    idIndicator: indicatorsMocks[0].idIndicator,
    idQuest: QuestsMocks[0].idQuest,
    idFromUser: usersMocks[0].id,
    idToUser: '',
    value: '',
  },
  {
    idResult: '3',
    idIndicator: indicatorsMocks[1].idIndicator,
    idQuest: QuestsMocks[0].idQuest,
    idFromUser: usersMocks[0].id,
    idToUser: '',
    value: '',
  },
  ...teamsMocks[0].members.map((member): QuestResult => {
    return {
      idResult: '22' + member.userId,
      idIndicator: indicatorsMocks[2].idIndicator,
      idQuest: QuestsMocks[0].idQuest,
      idFromUser: usersMocks[0].id,
      idToUser: member.userId,
      value: '',
    }
  }),
]

export const usersQuestStatMocks: UsersQuestStat[] = [
  {
    id: usersMocks[0].id,
    name: usersMocks[0].firstName + usersMocks[0].lastName,
    progress: false,
  },
  {
    id: usersMocks[1].id,
    name: usersMocks[1].firstName + usersMocks[1].lastName,
    progress: false,
  },
  {
    id: usersMocks[2].id,
    name: usersMocks[2].firstName + usersMocks[2].lastName,
    progress: false,
  },
  {
    id: usersMocks[3].id,
    name: usersMocks[3].firstName + usersMocks[3].lastName,
    progress: true,
  },
]
export const teamsQuestStatMocks: MembersCollapseData[] = [
  {
    id: teamsMocks[0].id,
    name: teamsMocks[0].name,
    progress: ((2 / 4) * 100).toString(),
    users: [
      usersQuestStatMocks[0],
      usersQuestStatMocks[1],
      usersQuestStatMocks[2],
      usersQuestStatMocks[3],
    ],
  },
  {
    id: teamsMocks[1].id,
    name: teamsMocks[1].name,
    progress: ((2 / 3) * 100).toString(),
    users: [usersQuestStatMocks[0], usersQuestStatMocks[2], usersQuestStatMocks[3]],
  },
  {
    id: teamsMocks[2].id,
    name: teamsMocks[2].name,
    progress: ((2 / 3) * 100).toString(),
    users: [usersQuestStatMocks[0], usersQuestStatMocks[2], usersQuestStatMocks[3]],
  },
]
export const QuestStatMocks: QuestCollapseData[] = [
  {
    id: QuestsMocks[0].idQuest,
    name: QuestsMocks[0].name,
    progress: (
      (parseFloat(teamsQuestStatMocks[0].progress) +
        parseFloat(teamsQuestStatMocks[1].progress) +
        parseFloat(teamsQuestStatMocks[2].progress)) /
      3
    ).toString(),
    teams: [teamsQuestStatMocks[0], teamsQuestStatMocks[1], teamsQuestStatMocks[2]],
  },
  {
    id: QuestsMocks[1].idQuest,
    name: QuestsMocks[1].name,
    progress: teamsQuestStatMocks[0].progress,
    teams: [teamsQuestStatMocks[0]],
  },
  {
    id: QuestsMocks[2].idQuest,
    name: QuestsMocks[2].name,
    progress: teamsQuestStatMocks[0].progress,
    teams: [teamsQuestStatMocks[0]],
  },
  {
    id: QuestsMocks[3].idQuest,
    name: QuestsMocks[3].name,
    progress: teamsQuestStatMocks[0].progress,
    teams: [teamsQuestStatMocks[0]],
  },
]
