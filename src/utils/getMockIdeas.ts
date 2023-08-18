import { Idea } from '@Domain/Idea'

function getMockIdeas(): Idea[] {
  return [
    {
      id: 0,
      name: 'Идея 1',
      dateCreated: new Date(),
      dateModified: new Date(),
      status: 'ON_EDITING',
      rating: 5,
      risk: 0.2,
      comments: [],
    },
    {
      id: 1,
      name: 'Идея 2',
      dateCreated: new Date(),
      dateModified: new Date(),
      status: 'ON_APPROVAL',
      rating: 5,
      risk: 0.2,
      comments: [],
    },
  ]
}

export default getMockIdeas
