import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'
import UsersGroup from '@Domain/UsersGroup'
import Comment from '@Domain/Comment'
import { Idea, Rating } from '@Domain/Idea'
import Team from '@Domain/Team'
import TeamMember from '@Domain/TeamMember'
import { TeamRequest, TeamRequestsAndInvitations } from '@Domain/TeamRequest'
import {
  TeamInvitation,
  TeamUnregisteredInvitations,
  TeamRegisteredInvitations,
} from '@Domain/TeamInvitation'

interface Mocks {
  users: User[]
  usersEmails: string[]
  unregisteredInvitations: TeamUnregisteredInvitations[]
  registeredInvitations: TeamRegisteredInvitations[]
  skills: Skill[]
  usersGroups: UsersGroup[]
  teamMember: TeamMember[]
  comments: Comment[]
  ratings: Rating[]
  ideas: Idea[]
  teams: Team[]
  teamRequests: TeamRequest[]
  teamInvitations: TeamInvitation[]
  teamRequestsAndInvitations: TeamRequestsAndInvitations[]
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
      name: 'React JS',
      type: 'FRAMEWORK',
      confirmed: true,
    },
    {
      id: '2',
      name: 'C++',
      type: 'LANGUAGE',
      confirmed: false,
    },
  ]
  const unregisteredInvitations: TeamUnregisteredInvitations[] = [
    {
      emails: ['first@mail.com', 'second@mail.com', 'third@mail.com'],
    },
  ]
  const registeredInvitations: TeamRegisteredInvitations[] = [
    {
      users: ['fourth@mail.com', 'fifth@fg.dc'],
    },
  ]
  const teamInvitations: TeamInvitation[] = [
    {
      id: 0,
      userEmail: '1wgwrgw2@mail.com',
      teamId: '0',
      inviter: {
        id: 0,
        token: '10296538',
        email: 'test1@gmail.com',
        firstName: 'Админ',
        lastName: 'Админ',
        roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
        skills: [...skills],
      },
      createdAt: new Date(0, 0, 0),
    },
    {
      id: 1,
      user: {
        id: 5,
        token: '10296538',
        email: 'test451@gmail.com',
        firstName: 'Чел',
        lastName: 'Чел',
        roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
        skills: [...skills],
      },
      teamId: '0',
      inviter: {
        id: 0,
        token: '10296538',
        email: 'test1@gmail.com',
        firstName: 'Админ',
        lastName: 'Админ',
        roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
        skills: [...skills],
      },
      createdAt: new Date(0, 0, 0),
    },
  ]
  const teamRequests: TeamRequest[] = [
    {
      id: 0,
      teamId: '0',
      sender: {
        id: 0,
        token: '10296538',
        email: 'admin@mail.com',
        firstName: 'Админ',
        lastName: 'Админ',
        roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
        skills: [
          {
            id: '0',
            name: 'Python',
            type: 'LANGUAGE',
            confirmed: true,
          },
        ],
      },
      text: 'Выпустите',
      type: 'leave',
      requestDate: new Date(10, 10, 23).toLocaleDateString(),
    },
    {
      id: 1,
      teamId: '0',
      sender: {
        id: 0,
        token: '10296538',
        email: 'admin@mail.com',
        firstName: 'Админ',
        lastName: 'Админ',
        roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
        skills: [
          {
            id: '0',
            name: 'Java',
            type: 'LANGUAGE',
            confirmed: true,
          },
        ],
      },
      text: 'Впустите',
      type: 'enter',
      requestDate: new Date(10, 10, 22).toLocaleDateString(),
    },
  ]
  const teamRequestsAndInvitations: TeamRequestsAndInvitations[] = [
    {
      requests: teamRequests,
      invitations: teamInvitations,
      teamId: '0',
    },
  ]

  const users: User[] = [
    {
      id: 0,
      token: '10296538',
      email: 'test1@gmail.com',
      firstName: 'Админ',
      lastName: 'Админ',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
      skills: [...skills],
    },

    {
      id: 1,
      token: '613098',
      email: '1@mail.com',
      firstName: 'Пользователь',
      lastName: 'Пользователь',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
      skills: [...skills],
    },

    {
      id: 2,
      token: '059182',
      email: '2@mail.com',
      firstName: 'Менеджер',
      lastName: 'Менеджер',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
      skills: [...skills],
    },

    {
      id: 3,
      token: '163097',
      email: '3@mail.com',
      firstName: 'Владелец',
      lastName: 'Владелец',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
      skills: [...skills],
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
          id: '2',
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
          id: '0',
          name: 'JavaScript',
          type: 'LANGUAGE',
          confirmed: true,
        },
        {
          id: '1',
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
      id: '0',
      ideaId: '0',
      sender: 'admin@mail.com',
      comment: 'Комментарий 1',
      checkedBy: [],
      createdAt: new Date(),
    },
    {
      id: '1',
      ideaId: '0',
      sender: '1@mail.com',
      comment: 'Комментарий 2',
      checkedBy: [],
      createdAt: new Date(),
    },
    {
      id: '2',
      ideaId: '1',
      sender: '2@mail.com',
      comment: 'Комментарий 3',
      checkedBy: ['1@mail.com', '2@mail.com'],
      createdAt: new Date(),
    },
  ]

  const ratings: Rating[] = [
    {
      id: '0',
      ideaId: '0',
      expert: 'admin@mail.com',
      budget: 1,
      technicalRealizability: 1,
      suitability: 2,
      rating: 8 / 5,
      originality: 3,
      marketValue: 1,
      confirmed: true,
    },
    {
      id: '1',
      ideaId: '1',
      expert: '1@mail.com',
      budget: 1,
      technicalRealizability: 1,
      suitability: 5,
      rating: 17 / 5,
      originality: 5,
      marketValue: 5,
      confirmed: true,
    },
  ]

  const ideas: Idea[] = [
    {
      id: '0',
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
      experts: [],
      projectOffice: [],
      rating: 5,
      budget: 1,
      suitability: 1,
      technicalRealizability: 1,
      preAssessment: 0,
    },
    {
      id: '1',
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
      experts: [],
      projectOffice: [],
      rating: 5,
      budget: 1,
      suitability: 1,
      technicalRealizability: 1,
      preAssessment: 0,
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
      id: 0,
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

  return {
    users,
    usersEmails,
    teamMember,
    skills,
    usersGroups,
    comments,
    ratings,
    ideas,
    teams,
    teamRequests,
    teamInvitations,
    unregisteredInvitations,
    registeredInvitations,
    teamRequestsAndInvitations,
  }
}

export default getMocks
