import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'
import UsersGroup from '@Domain/UsersGroup'
import Comment from '@Domain/Comment'
import { Idea, IdeaSkills, Rating } from '@Domain/Idea'
import Team from '@Domain/Team'
import TeamMember from '@Domain/TeamMember'
import Notification from '@Domain/Notification'
import { TeamAccession, InvitedUsers } from '@Domain/TeamAccession'
import Profile from '@Domain/Profile'

interface Mocks {
  users: User[]
  usersEmails: string[]
  unregisteredInvitations: InvitedUsers[]
  registeredInvitations: InvitedUsers[]
  skills: Skill[]
  usersGroups: UsersGroup[]
  teamMember: TeamMember[]
  comments: Comment[]
  ideas: Idea[]
  ratings: Rating[]
  ideasSkills: IdeaSkills[]
  teams: Team[]
  teamAccessions: TeamAccession[]
  teamRequests: TeamAccession[]
  teamInvitations: TeamAccession[]
  profiles: Profile[]
  notifications: Notification[]
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
      id: 0,
      teamId: 0,
      targetEmail: 'admin@mail.com',
      targetUserType: 'REGISTERED',
      text: 'Выпустите',
      requestType: 'LEAVE',
      updatedAt: '2022-11-20T11:02:17Z',
      stage: 'REQUEST',
    },
    {
      id: 1,
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
      email: 'test1@gmail.com',
      firstName: 'Админ',
      lastName: 'Адмиг',

      skills: [...skills],
    },
    {
      id: 343,
      email: 'test1@gmail.com',
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
      initiator: '0',
      name: 'Идея по созданию идеи Идея по созданию идеи Идея по созданию идеи Идея по созданию идеи',
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
      initiator: '1',
      name: 'Идея 1',
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
      name: 'Команда 1',
      closed: false,
      createdAt: '2023-10-23T11:02:17Z',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      membersCount: 4,
      owner: teamMember[0],
      leader: teamMember[1],
      members: [...teamMember],
      skills: [],
    },
    {
      id: 1,
      name: 'Команда 2',
      closed: true,
      createdAt: '2023-10-25T11:02:17Z',
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      membersCount: 3,
      owner: teamMember[1],
      leader: teamMember[2],
      members: [teamMember[3], teamMember[2]],
      skills: [...skills],
    },
  ]

  const notifications: Notification[] = [
    {
      id: 0,
      title: 'Чат 1',
      message: 'Попов(менеджер, проект 1): дедлайн завтра',
      isReaded: false,
      isFavourite: false,
      createdAt: '20:15 28.09.23',
    },
    {
      id: 1,
      title: 'Чат 2',
      message: 'Петров(менеджер, проект 2): завтра',
      isReaded: false,
      isFavourite: false,
      createdAt: '12:34 28.09.23',
    },
    {
      id: 2,
      title: 'Чат 1',
      message: 'Попов(менеджер, проект 1): дедлайн завтра',
      isReaded: true,
      isFavourite: false,
      createdAt: '14:40 27.09.23',
    },
    {
      id: 3,
      title: 'Чат 2',
      message: 'Петров(менеджер, проект 2): дедлайн завтра',
      isReaded: true,
      isFavourite: false,
      createdAt: '12:34 26.09.23',
    },
  ]

  const profiles: Profile[] = [
    {
      userId: 0,
      userEmail: 'test1@gmail.com',
      firstName: 'Админ',
      lastName: 'Админ',
      skills: skills,
    },

    {
      userId: 1,
      userEmail: '1@mail.com',
      firstName: 'Пользователь',
      lastName: 'Пользователь',
      skills: skills,
    },

    {
      userId: 2,
      userEmail: '2@mail.com',
      firstName: 'Менеджер',
      lastName: 'Менеджер',
      skills: skills,
    },

    {
      userId: 3,
      userEmail: '3@mail.com',
      firstName: 'Владелец',
      lastName: 'Владелец',
      skills: skills,
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
    teamAccessions,
    profiles,
    notifications,
  }
}

export default getMocks
