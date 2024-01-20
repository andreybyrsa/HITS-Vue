import { Tag } from '@Domain/Tag'

interface TagModalProps {
  isOpened: boolean
  tag?: Tag | null
}

interface TagModalEmits {
  (event: 'close-modal'): void
}

export { TagModalProps, TagModalEmits }
