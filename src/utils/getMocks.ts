import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'
import UsersGroup from '@Domain/UsersGroup'
import Comment from '@Domain/Comment'
import { Idea, IdeaSkills, Rating } from '@Domain/Idea'
import Team from '@Domain/Team'
import TeamMember from '@Domain/TeamMember'
import { TeamRequest, TeamRequestsAndInvitations } from '@Domain/TeamRequest'
import { TeamInvitation, TeamInvitations } from '@Domain/TeamInvitation'

interface Mocks {
  users: User[]
  usersEmails: string[]
  unregisteredInvitations: TeamInvitations[]
  registeredInvitations: TeamInvitations[]
  skills: Skill[]
  usersGroups: UsersGroup[]
  teamMember: TeamMember[]
  comments: Comment[]
  ideas: Idea[]
  ratings: Rating[]
  ideasSkills: IdeaSkills[]
  teams: Team[]
  teamRequests: TeamRequest[]
  teamInvitations: TeamInvitation[]
  teamRequestsAndInvitations: TeamRequestsAndInvitations[]
}

function getMocks(): Mocks {
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
  const unregisteredInvitations: TeamInvitations[] = [
    {
      emails: ['first@mail.com', 'second@mail.com', 'third@mail.com'],
    },
  ]
  const registeredInvitations: TeamInvitations[] = [
    {
      emails: ['fourth@mail.com', 'fifth@fg.dc'],
    },
  ]
  const teamInvitations: TeamInvitation[] = [
    {
      id: 0,
      userEmail: '1wgwrgw2@mail.com',
      teamId: '0',
      inviter: {
        id: 0,
        email: 'test1@gmail.com',
        firstName: 'Админ',
        lastName: 'Админ',
        skills: [...skills],
      },
      createdAt: new Date(0, 0, 0).toUTCString(),
    },
    {
      id: 1,
      user: {
        userId: 5,
        userEmail: 'test451@gmail.com',
        firstName: 'Чел',
        lastName: 'Чел',
        skills: [...skills],
      },
      teamId: '0',
      inviter: {
        id: 0,
        email: 'test1@gmail.com',
        firstName: 'Админ',
        lastName: 'Админ',
        skills: [...skills],
      },
      createdAt: new Date(0, 0, 0).toLocaleDateString(),
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
      },
      text: 'Выпустите',
      type: 'leave',
      createdAt: new Date(10, 10, 23).toLocaleDateString(),
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
      },
      text: 'Впустите',
      type: 'enter',
      createdAt: new Date(10, 10, 22).toLocaleDateString(),
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
      id: 33,
      email: 'admin@mail.com',
      firstName: 'Админ',
      lastName: 'Адмиг',

      skills: [...skills],
    },
    {
      id: 343,
      email: 'admin@mail.com',
      firstName: 'Админ',
      lastName: 'Адмиг',

      skills: [...skills],
    },
    {
      id: 3,
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
      id: 345,
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
      createdAt: new Date(13, 10, 2023).toLocaleDateString(),
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      owner: teamMember[0],
      leader: teamMember[1],
      members: [...teamMember],
      skills: [...skills],
    },
    {
      id: 1,
      name: 'Команда новая',
      closed: false,
      createdAt: new Date(13, 10, 2023).toLocaleDateString(),
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      owner: teamMember[1],
      leader: teamMember[2],
      members: [teamMember[2], teamMember[3]],
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
    ideasSkills,
    teams,
    teamRequests,
    teamInvitations,
    unregisteredInvitations,
    registeredInvitations,
    teamRequestsAndInvitations,
  }
}

export default getMocks
