import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'
import UsersGroup from '@Domain/UsersGroup'
import Comment from '@Domain/Comment'
import { Idea, IdeaSkills, Rating } from '@Domain/Idea'
import Team from '@Domain/Team'
import TeamMember from '@Domain/TeamMember'
import RequestTeams from '@Domain/RequestTeams'
import IdeasMarket from '@Domain/IdeasMarket'
import Notification from '@Domain/Notification'
import { TeamAccession, InvitedUsers } from '@Domain/TeamAccession'

interface Mocks {
  users: User[]
  usersEmails: string[]
  unregisteredInvitations: InvitedUsers[]
  registeredInvitations: InvitedUsers[]
  skills: Skill[]
  usersGroups: UsersGroup[]
  comments: Comment[]
  ideas: Idea[]
  ratings: Rating[]
  ideasSkills: IdeaSkills[]
  teams: Team[]
  RequestTeams: RequestTeams[]
  IdeasMarket: IdeasMarket[]
  teamAccessions: TeamAccession[]
  teamRequests: TeamAccession[]
  teamInvitations: TeamAccession[]
  profiles: TeamMember[]
  notifications: Notification[]
}

function getMocks(): Mocks {
  const unregisteredInvitations: InvitedUsers[] = [
    {
      emails: ['first@mail.com', 'second@mail.com', 'third@mail.com'],
    },
  ]
  const registeredInvitations: InvitedUsers[] = [
    {
      emails: ['fourth@mail.com', 'fifth@fg.dc'],
    },
  ]
  const skills: Skill[] = [
    {
      id: 0,
      name: 'JavaScript',
      type: 'LANGUAGE',
      confirmed: true,
    },
    {
      id: 1,
      name: 'C++',
      type: 'LANGUAGE',
      confirmed: true,
    },
    {
      id: 2,
      name: 'Python',
      type: 'LANGUAGE',
      confirmed: true,
    },
    {
      id: 3,
      name: 'TypeScript',
      type: 'LANGUAGE',
      confirmed: true,
    },
    {
      id: 4,
      name: 'Java',
      type: 'LANGUAGE',
      confirmed: true,
    },
    {
      id: 5,
      name: 'C#',
      type: 'LANGUAGE',
      confirmed: true,
    },
    {
      id: 6,
      name: 'ReactJS',
      type: 'FRAMEWORK',
      confirmed: true,
    },
    {
      id: 7,
      name: 'Django',
      type: 'FRAMEWORK',
      confirmed: true,
    },
    {
      id: 8,
      name: 'VueJS',
      type: 'FRAMEWORK',
      confirmed: true,
    },
    {
      id: 9,
      name: 'Docker',
      type: 'DEVOPS',
      confirmed: true,
    },
    {
      id: 10,
      name: 'MongoDB',
      type: 'DATABASE',
      confirmed: true,
    },
    {
      id: 11,
      name: 'NodeJS',
      type: 'DATABASE',
      confirmed: true,
    },
  ]

  const teamInvitations: TeamAccession[] = [
    {
      id: 0,
      teamId: 0,
      targetEmail: '1wgwrgw2@mail.com',
      targetUserType: 'UNREGISTERED',
      inviter: {
        id: 0,
        email: 'test1@gmail.com',
        firstName: 'Админ',
        lastName: 'Админ',
        skills: [...skills],
      },
      updatedAt: '2021-11-20T14:02:17Z',
      stage: 'INVITATION',
    },
    {
      id: 1,
      targetEmail: 'test451@gmail.com',
      targetUserType: 'UNREGISTERED',
      teamId: 0,
      inviter: {
        id: 0,
        email: 'test1@gmail.com',
        firstName: 'Админ',
        lastName: 'Админ',
        skills: [...skills],
      },
      updatedAt: '2022-11-20T14:02:17Z',
      stage: 'INVITATION',
    },
  ]
  const teamRequests: TeamAccession[] = [
    {
      id: 3,
      teamId: 0,
      targetEmail: 'admin@mail.com',
      targetUserType: 'REGISTERED',
      text: 'Выпустите',
      requestType: 'LEAVE',
      updatedAt: '2022-11-20T11:02:17Z',
      stage: 'REQUEST',
    },
    {
      id: 4,
      teamId: 0,
      targetEmail: 'admin@mail.com',
      targetUserType: 'REGISTERED',
      text: 'Впустите',
      requestType: 'ENTER',
      updatedAt: '2023-10-20T11:02:17Z',
      stage: 'REQUEST',
    },
  ]
  const teamAccessions: TeamAccession[] = [...teamInvitations, ...teamRequests]

  const users: User[] = [
    {
      id: 0,
      token: '10296538',
      email: 'andrey@mail.com',
      firstName: 'Андрей',
      lastName: 'Бырса',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
    },
    {
      id: 1,
      token: '613098',
      email: 'timyr@mail.com',
      firstName: 'Тимур',
      lastName: 'Минязев',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
    },
    {
      id: 2,
      token: '059182',
      email: 'kirill.vlasov.05@inbox.ru',
      firstName: 'Кирилл',
      lastName: 'Власов',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
    },
    {
      id: 3,
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
      email: 'andrey@mail.com',
      id: 33,
      firstName: 'Андрей',
      lastName: 'Бырса',

      skills: [
        skills[0],
        skills[3],
        skills[6],
        skills[7],
        skills[8],
        skills[9],
        skills[11],
      ],
    },
    {
      email: 'timyr@mail.com',
      id: 343,
      firstName: 'Тимур',
      lastName: 'Минязев',

      skills: [
        skills[0],
        skills[2],
        skills[3],
        skills[4],
        skills[7],
        skills[8],
        skills[9],
      ],
    },
    {
      email: 'kirill.vlasov.05@inbox.ru',
      id: 3,
      firstName: 'Кирилл',
      lastName: 'Власов',

      skills: [skills[0], skills[3], skills[6], skills[7], skills[8], skills[9]],
    },
    {
      email: 'maga@mail.com',
      id: 345,
      firstName: 'Мамедага',
      lastName: 'Байрамов',

      skills: [skills[0], skills[3], skills[7], skills[8], skills[9], skills[11]],
    },
  ]

  const comments: Comment[] = [
    {
      id: 0,
      ideaId: 0,
      createdAt: '2023-10-20T11:02:17Z',

      senderEmail: 'andrey@mail.com',
      text: 'Комментарий 1',
      checkedBy: [],
    },
    {
      id: 1,
      ideaId: 0,
      createdAt: '2023-10-21T11:02:17Z',

      senderEmail: 'timyr@mail.com',
      text: 'Комментарий 2',
      checkedBy: [0, 1],
    },
    {
      id: 2,
      ideaId: 1,
      createdAt: '2023-10-21T11:02:17Z',

      senderEmail: 'kirill.vlasov.05@inbox.ru',
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
      initiator: 'andrey@mail.com',
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
      id: 1,
      initiator: 'kirill.vlasov.05@inbox.ru',
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
      id: 2,
      initiator: '2',
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
      id: 3,
      initiator: '2',
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
    {
      ideaId: 0,
      skills: [skills[0], skills[2], skills[3], skills[6], skills[9], skills[11]],
    },
    {
      ideaId: 1,
      skills: [...skills],
    },
  ]

  const teams: Team[] = [
    {
      id: 10,
      name: 'Фронтендеры',
      closed: false,
      createdAt: '2023-10-20T11:02:17Z',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      membersCount: 4,
      owner: teamMember[0],
      leader: teamMember[1],
      members: [...teamMember],
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
    },
    {
      id: 11,
      name: 'Бэккендеры',
      closed: false,
      createdAt: '2023-10-20T11:02:17Z',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      membersCount: 3,
      owner: teamMember[2],
      leader: teamMember[2],
      members: [teamMember[1], teamMember[3]],
      skills: [
        skills[0],
        skills[2],
        skills[3],
        skills[4],
        skills[7],
        skills[8],
        skills[9],
        skills[11],
      ],
    },
    {
      id: 12,
      name: 'Мушкетеры',
      closed: false,
      createdAt: '2023-10-20T11:02:17Z',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      membersCount: 4,
      owner: teamMember[2],
      leader: teamMember[1],
      members: [teamMember[0], teamMember[1]],
      skills: [
        skills[0],
        skills[3],
        skills[6],
        skills[7],
        skills[8],
        skills[9],
        skills[11],
      ],
    },
    {
      id: 13,
      name: 'Смешарики',
      closed: true,
      createdAt: '2023-10-20T11:02:17Z',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      membersCount: 4,
      owner: teamMember[2],
      leader: teamMember[1],
      members: [teamMember[3]],
      skills: [skills[0]],
    },
  ]

  const RequestTeams: RequestTeams[] = [
    {
      id: 0,
      ideaId: 1,
      accepted: false,
      teamId: 0,

      name: 'Первые разрабы мира',
      closed: false,
      membersCount: 4,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      owner: teamMember[1],
      leader: teamMember[2],
      members: [...teamMember],
      skills: [skills[0], skills[2], skills[4], skills[6], skills[8], skills[11]],
      createdAt: '2023-10-20T11:02:17Z',
      letter:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorbeatae ipsum dicta omnis adipisci magni autem eos quisquam doloresmaxime. Dignissimos cum nulla consequatur accusantium distinctioaut. Velit, assumenda porro!',
    },
    {
      id: 1,
      ideaId: 1,
      accepted: false,
      teamId: 1,

      name: 'Программисты из apple',
      closed: false,
      createdAt: '2023-10-20T11:02:17Z',
      membersCount: 4,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      owner: teamMember[1],
      leader: teamMember[2],
      members: [...teamMember],
      skills: [
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
      id: 2,
      ideaId: 1,
      accepted: true,
      teamId: 2,

      name: 'Удальцы',
      closed: false,
      createdAt: '2023-10-20T11:02:17Z',
      membersCount: 4,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      owner: teamMember[1],
      leader: teamMember[2],
      members: [...teamMember],
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
      id: 3,
      ideaId: 1,
      accepted: false,
      teamId: 3,

      name: 'Молодцы',
      closed: false,
      createdAt: '2023-10-20T11:02:17Z',
      membersCount: 4,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      owner: teamMember[1],
      leader: teamMember[2],
      members: [...teamMember],
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
      id: 4,
      ideaId: 2,
      accepted: false,
      teamId: 4,

      name: 'Хорошая компания',
      closed: false,
      createdAt: '2023-10-20T11:02:17Z',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      owner: teamMember[1],
      leader: teamMember[2],
      membersCount: 4,
      members: [...teamMember],
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
      id: 5,
      ideaId: 2,
      accepted: false,
      teamId: 5,

      name: 'Негатив',
      closed: false,
      createdAt: '2023-10-20T11:02:17Z',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      owner: teamMember[1],
      leader: teamMember[2],
      membersCount: 4,
      members: [...teamMember],
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
      id: 6,
      ideaId: 2,
      accepted: true,
      teamId: 6,

      name: 'Позитив',
      closed: false,
      createdAt: '2023-10-20T11:02:17Z',
      membersCount: 4,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      owner: teamMember[1],
      leader: teamMember[2],
      members: [...teamMember],
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
      id: 7,
      ideaId: 2,
      accepted: false,
      teamId: 13,

      name: 'Смешарики',
      closed: false,
      createdAt: '2023-10-20T11:02:17Z',
      membersCount: 4,
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      owner: teamMember[1],
      leader: teamMember[2],
      members: [...teamMember],
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

  const IdeasMarket: IdeasMarket[] = [
    {
      id: 1,
      position: 1,
      name: 'BaccaratHelper',
      initiator: teamMember[2],
      problem:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      solution:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      result:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      description:
        'Проект для казино, созданный при помощи искусственого интеллекта и предварительно считывающий выдаваемые карты при помощи математической статистики...',
      stack: [skills[0], skills[2], skills[3], skills[6], skills[9], skills[11]],
      customer: 'ВШЦТ',
      createdAt: '2023-10-21T11:02:17Z',
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
      initiator: teamMember[0],
      problem:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      solution:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      result:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      description:
        'Проект для казино, созданный при помощи искусственого интеллекта и предварительно считывающий выдаваемые карты при помощи математической статистики................',
      stack: [skills[1], skills[2], skills[4], skills[9], skills[10]],
      customer: 'ВШЦТ',
      createdAt: '2023-10-21T11:02:17Z',
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
      initiator: teamMember[1],
      problem:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      solution:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      result:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      description:
        'Проект для казино, созданный при помощи искусственого интеллекта и предварительно считывающий выдаваемые карты при помощи математической статистики...',
      stack: [skills[1], skills[2], skills[4], skills[9], skills[10]],
      customer: 'ВШЦТ',
      createdAt: '2023-10-21T11:02:17Z',
      maxTeamSize: 10,
      status: 'RECRUITMENT_IS_OPEN',
      requests: 0,
      acceptedRequests: 0,
      isFavorite: false,
    },
  ]
  const notifications: Notification[] = [
    {
      id: 0,
      userId: 0,
      title: 'Чат 1',
      message: 'Попов(менеджер, проект 1): дедлайн завтра',
      isShowed: true,
      isReaded: false,
      isFavourite: false,
      createdAt: '2023-10-25T11:02:17Z',
    },
    {
      id: 1,
      userId: 1,
      title: 'Чат 2',
      message: 'Петров(менеджер, проект 2): завтра',
      isShowed: false,
      isReaded: false,
      isFavourite: false,
      createdAt: '2023-10-28T11:02:17Z',
    },
    {
      id: 2,
      userId: 2,
      title: 'Чат 1',
      message: 'Попов(менеджер, проект 1): дедлайн завтра',
      isShowed: false,
      isReaded: true,
      isFavourite: false,
      createdAt: '2023-10-20T11:02:17Z',
    },
    {
      id: 3,
      userId: 2,
      title: 'Чат 2',
      message: 'Петров(менеджер, проект 2): дедлайн завтра',
      isShowed: true,
      isReaded: true,
      isFavourite: false,
      createdAt: '2023-10-30T11:02:17Z',
    },
  ]

  const profiles: TeamMember[] = [
    {
      id: 0,
      email: 'test1@gmail.com',
      firstName: 'Админ',
      lastName: 'Админ',
      skills: skills,
    },
    {
      id: 1,
      email: 'test2@gmail.com',
      firstName: 'Пользователь',
      lastName: 'Пользователь',
      skills: skills,
    },
    {
      id: 2,
      email: 'test3@gmail.com',
      firstName: 'Менеджер',
      lastName: 'Менеджер',
      skills: skills,
    },
    {
      id: 3,
      email: 'test4@gmail.com',
      firstName: 'Владелец',
      lastName: 'Владелец',
      skills: skills,
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
    RequestTeams,
    IdeasMarket,
    teamRequests,
    teamInvitations,
    unregisteredInvitations,
    registeredInvitations,
    teamAccessions,
    profiles,
    notifications,
  }
}

export default getMocks
