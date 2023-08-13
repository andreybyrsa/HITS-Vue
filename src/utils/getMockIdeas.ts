import { Idea } from '@Domain/Idea'

function getMockIdeas(): Idea[] {
  return [
    {
      name: 'Идея 1',
      dateCreated: new Date(),
      dateModified: new Date(),
      status: 'ON_EDITING',
      rating: 5,
      risk: 0.2,
    },
    {
      name: 'Идея 2',
      dateCreated: new Date(),
      dateModified: new Date(),
      status: 'ON_APPROVAL',
      rating: 5,
      risk: 0.2,
    },
  ]
}

export default getMockIdeas
