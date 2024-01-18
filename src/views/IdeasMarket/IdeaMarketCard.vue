<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'

import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import Skills from '@Components/Skills/Skills.vue'

import {
  IdeaMarketCardProps,
  IdeaMarketCardEmits,
} from '@Views/IdeasMarket/IdeasMarketView.types'

import { IdeaMarket, IdeaMarketStatusType } from '@Domain/IdeaMarket'

import getIdeaMarketStatus from '@Utils/ideaMarketStatus'

import IdeasMarketService from '@Services/IdeasMarketService'

import useUserStore from '@Store/user/userStore'
import useNotificationsStore from '@Store/notifications/notificationsStore'
import useProjectsStore from '@Store/projects/projectsStore'

const props = defineProps<IdeaMarketCardProps>()
const emit = defineEmits<IdeaMarketCardEmits>()
const ideas = defineModel<IdeaMarket[]>('ideas', { required: true })

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const notificationsStore = useNotificationsStore()

const projectsStore = useProjectsStore()

const availableStatus = getIdeaMarketStatus()

const router = useRouter()
const route = useRoute()

function getTranslatedStatus(status: IdeaMarketStatusType) {
  return availableStatus.translatedStatus[status]
}

const handleAddIdeaToFavorites = async () => {
  const currentUser = user.value

  if (currentUser?.token && props.ideaMarket) {
    const { token } = currentUser
    const { id } = props.ideaMarket

    const response = await IdeasMarketService.addIdeaToFavorites(id, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    const currentIdea = ideas.value.find((idea) => idea.id === id)

    if (currentIdea) {
      currentIdea.isFavorite = true
    }
  }
}

const handleRemoveIdeaFromFavorites = async () => {
  const currentUser = user.value

  if (currentUser?.token && props.ideaMarket) {
    const { token } = currentUser
    const { id } = props.ideaMarket

    const response = await IdeasMarketService.removeIdeaFromFavorites(id, token)

    if (response instanceof Error) {
      return notificationsStore.createSystemNotification('Система', response.message)
    }

    const currentIdeaIndex = ideas.value.findIndex((idea) => idea.id === id)

    if (props.isAllIdeas && currentIdeaIndex !== -1) {
      ideas.value[currentIdeaIndex].isFavorite = false
    } else if (!props.isAllIdeas && currentIdeaIndex !== -1) {
      ideas.value.splice(currentIdeaIndex, 1)
    }
  }
}

const handleConvertIdeaToProject = async () => {
  const currentUser = user.value

  if (currentUser?.token && props.ideaMarket && props.ideaMarket.team !== null) {
    const { token } = currentUser
    const { id, team } = props.ideaMarket
    const { members } = team

    await projectsStore.postProject(id, props.ideaMarket, token, team, members)
    console.log(projectsStore.projects)
  }
}

function checkIdeaOwned() {
  return (
    user.value?.role === 'TEAM_OWNER' &&
    props.ideaMarket.status === 'RECRUITMENT_IS_OPEN'
  )
}

function checkIdeaDone() {
  return (
    user.value?.role === ('ADMIN' || 'PROJECT_OFFICE') &&
    props.ideaMarket.status === 'RECRUITMENT_IS_CLOSED'
  )
}

function navigateToIdeaMarketModal(ideaMarketId: string) {
  const marketId = route.params.marketId.toString()

  router.push(`/market/${marketId}/${ideaMarketId}`)
}

function getIdeaMarketStatusStyle() {
  const { status } = props.ideaMarket
  const initialClass = ['d-flex', 'align-items-center', 'gap-1']

  if (status === 'RECRUITMENT_IS_OPEN') {
    initialClass.push('text-success')
    return initialClass
  } else if (status === 'PROJECT') {
    initialClass.push('text-warning')
    return initialClass
  }

  initialClass.push('text-danger')
  return initialClass
}
</script>

<template>
  <div class="idea-market col">
    <div class="p-3 w-100 h-100 rounded border shadow-sm d-flex flex-column gap-2">
      <div class="d-flex flex-column">
        <div class="w-100 d-flex align-items-start justify-content-between gap-2">
          <div
            class="idea-market__name bs-link mb-1 fw-semibold text-primary"
            @click="navigateToIdeaMarketModal(ideaMarket.id)"
          >
            <Typography class-name="me-1 fs-5 text-dark">
              #{{ ideaMarket.position }}
            </Typography>

            <Typography class-name="fs-5 fw-semibold cursor-pointer">
              {{ ideaMarket.name }}
            </Typography>
          </div>

          <Icon
            v-if="!ideaMarket.isFavorite"
            class-name="bi bi-bookmark fs-4 text-warning cursor-pointer"
            @click="handleAddIdeaToFavorites"
          />
          <Icon
            v-else
            class-name="bi bi-bookmark-fill fs-4 text-warning cursor-pointer"
            @click="handleRemoveIdeaFromFavorites"
          />
        </div>

        <div class="idea-market__solution">
          <Typography class-name="text-secondary">
            {{ ideaMarket.solution }}
          </Typography>
        </div>

        <div class="my-2 d-flex gap-1">
          <Icon class-name="bi bi-person-circle fs-5" />
          <Typography>
            Инициатор:
            {{ ideaMarket.initiator.firstName }}
            {{ ideaMarket.initiator.lastName }}
          </Typography>
        </div>
      </div>

      <Skills :skills="ideaMarket.stack" />

      <div
        class="mt-2 pt-2 border-top d-flex justify-content-between align-items-start gap-2"
      >
        <div class="idea-market__team-info d-flex flex-wrap row-gap-1 column-gap-3">
          <div :class="getIdeaMarketStatusStyle()">
            <Icon class-name="bi bi-circle-fill opacity-75" />
            <Typography>{{ getTranslatedStatus(ideaMarket.status) }}</Typography>
          </div>

          <div class="text-secondary d-flex align-items-center gap-1">
            <Icon class-name="bi bi-people-fill opacity-75" />
            <Typography>Команда из {{ ideaMarket.maxTeamSize }} человек</Typography>
          </div>

          <div class="text-secondary d-flex align-items-center gap-1">
            <Icon class-name="bi bi-envelope-fill opacity-75" />
            <Typography>Подано заявок {{ ideaMarket.requests }}</Typography>
          </div>
        </div>

        <Button
          v-if="checkIdeaOwned()"
          class-name="idea-market__send-request-button btn-sm"
          variant="primary"
          prepend-icon-name="bi bi-send-fill fs-6"
          @click="emit('send-quick-request', ideaMarket)"
        >
          Подать заявку
        </Button>

        <Button
          v-if="checkIdeaDone()"
          class-name="idea-market__send-idea-button blink btn-sm"
          variant="success"
          prepend-icon-name="bi bi-plus-lg fs-6"
          @click="handleConvertIdeaToProject"
        >
          Перевести в проект
        </Button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.idea-market {
  &__name {
    @include textEllipsis(2);
  }

  &__solution {
    @include textEllipsis(3);
  }

  &__send-request-button {
    @include fixedWidth(135px);
  }

  &__send-idea-button {
    @include fixedWidth(170px);
  }

  .blink {
    animation: blink 0.5s infinite;
  }
  @keyframes blink {
    from {
      opacity: 1;
    }
    to {
      opacity: 0.8;
      box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.5);
    }
  }
}
</style>
