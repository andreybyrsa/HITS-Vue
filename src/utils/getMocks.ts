import { User } from '@Domain/User'
import { Skill } from '@Domain/Skill'
import UsersGroup from '@Domain/UsersGroup'
import { Idea } from '@Domain/Idea'
import Team from '@Domain/Team'

interface Mocks {
  users: User[]
  skills: Skill[]
  usersGroups: UsersGroup[]
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
      skills: [],
    },

    {
      id: '1',
      token: '613098',
      email: '1@mail.com',
      firstName: 'Пользователь',
      lastName: 'Пользователь',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
      skills: [],
    },

    {
      id: '2',
      token: '059182',
      email: '2@mail.com',
      firstName: 'Менеджер',
      lastName: 'Менеджер',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
      skills: [],
    },

    {
      id: '3',
      token: '163097',
      email: '3@mail.com',
      firstName: 'Владелец',
      lastName: 'Владелец',
      roles: ['INITIATOR', 'PROJECT_OFFICE', 'EXPERT', 'ADMIN'],
      skills: [],
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
      description:
        'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eius aperiam delectus possimus, voluptates quo accusamus? Consequatur, quasi rem temporibus blanditiis delectus aliquid officia aut, totam incidunt reiciendis eaque laborum fugiat!',
      owner: users[1],
      leader: users[2],
      members: [users[3]],
      skills: [...skills],
    },
  ]

  return { users, skills, usersGroups, ideas, teams }
}

export default getMocks
