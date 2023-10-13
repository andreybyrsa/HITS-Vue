import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'
import UsersGroup from '@Domain/UsersGroup'
import Comment from '@Domain/Comment'
import { Idea, Rating } from '@Domain/Idea'
import Team from '@Domain/Team'
import TeamMember from '@Domain/TeamMember'

interface Mocks {
  users: User[]
  usersEmails: string[]
  skills: Skill[]
  usersGroups: UsersGroup[]
  teamMember: TeamMember[]
  comments: Comment[]
  ratings: Rating[]
  ideas: Idea[]
  teams: Team[]
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
      firstName: 'Пользователь',
      lastName: 'Пользователь',
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
  ]

  const usersEmails: string[] = users.map((user) => user.email)

  const skills: Skill[] = [
    {
      id: '0',
      skillId: '0',
      name: 'JavaScript',
      type: 'LANGUAGE',
      confirmed: true,
    },
    {
      id: '1',
      skillId: '1',
      name: 'React JS',
      type: 'FRAMEWORK',
      confirmed: true,
    },
    {
      id: '2',
      skillId: '2',
      name: 'C++',
      type: 'LANGUAGE',
      confirmed: false,
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
          skillId: '2',
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
          skillId: '0',
          name: 'JavaScript',
          type: 'LANGUAGE',
          confirmed: true,
        },
        {
          id: '1',
          skillId: '1',
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
      id: '0',
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
      id: '0',
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
  }
}

export default getMocks
