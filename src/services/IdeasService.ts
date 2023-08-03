import getMockIdeas from '@Utils/getMockIdeas'

const fetchIdeas = async () => {
  const ideas = await new Promise((resolve) => setTimeout(resolve, 1000)).then(
    () => getMockIdeas(),
  )

  return ideas
}

const IdeasService = {
  fetchIdeas,
}

export default IdeasService
