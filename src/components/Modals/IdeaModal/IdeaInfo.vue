<script lang="ts" setup>
import { ref } from 'vue'
import { RouteRecordRaw, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { MODE } from '@Main'

import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import { IdeaInfoProps } from '@Components/Modals/IdeaModal/IdeaModal.types'
import Button from '@Components/Button/Button.vue'
import Profile from '@Components/Modals/ProfileModal/ProfileModal.vue'

import useUserStore from '@Store/user/userStore'

import modeButtons from '@Components/Modals/IdeaModal/IdeaInfo.types'

import { getIdeaStatus } from '@Utils/ideaStatus'
import navigateToAliasRoute from '@Utils/navigateToAliasRoute'

const props = defineProps<IdeaInfoProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const route = useRoute()

const status = getIdeaStatus()

const isCopiedLink = ref(false)

function getModeButtonText() {
  const currentUser = user.value

  if (currentUser && currentUser.role) {
    const { id, role } = currentUser
    const { initiator, status } = props.idea

    const currentModeButton = modeButtons.find(
      (button) => button.roles.includes(role) && button.status.includes(status),
    )
    if (currentModeButton) return currentModeButton.text

    if ((status === 'NEW' || status === 'ON_EDITING') && id === initiator.id) {
      return 'Редактрирование'
    }

    return 'Просмотр'
  }
}

function copyLink() {
  const link =
    MODE === 'DEVELOPMENT'
      ? `http://localhost:8080${route.fullPath}`
      : `https://hits.tyuiu.ru${route.fullPath}`

  navigator.clipboard.writeText(link)
  isCopiedLink.value = true
}

function getIdeaModalStatus() {
  const { idea, expertRatings } = props

  if (idea.status === 'ON_CONFIRMATION' && expertRatings) {
    const confirmedRatings = expertRatings.reduce(
      (prevValue, value) => (value.isConfirmed ? (prevValue += 1) : prevValue),
      0,
    )
    return `Утвердили ${confirmedRatings}/${expertRatings.length}`
  }

  return status.translatedStatus[idea.status]
}

function getExpertRatingicon(isConfirmed: boolean) {
  let initialClassName = 'text-secondary fs-3 opacity-25'

  if (isConfirmed) {
    return (initialClassName += ' bi bi-check-lg text-success opacity-50')
  }

  return (initialClassName += ' bi bi-clock-history opacity-25')
}

function getRatingColor(rating: number | null) {
  if (rating) {
    if (rating >= 4.0) {
      return 'text-success'
    }
    if (rating < 4.0 && rating >= 3.0) {
      return 'text-warning'
    }
    return 'text-danger'
  }
}

function getAccessToExpertsInfo() {
  const currentUser = user.value
  return (
    props.expertRatings &&
    (currentUser?.role === 'PROJECT_OFFICE' || currentUser?.role === 'ADMIN')
  )
}

function navigateToProfileModal(id: string) {
  const profileModalRoute: RouteRecordRaw = {
    name: 'profile',
    path: 'profile/:id',
    alias: '/profile/:id',
    component: Profile,
    props: {
      canGoBack: true,
    },
  }

  navigateToAliasRoute('ideas-list', `/profile/${id}`, profileModalRoute)
}
</script>

<template>
  <Typography class-name="p-2 bg-primary rounded-top fs-4 text-center text-white">
    {{ getIdeaModalStatus() }}
  </Typography>

  <div class="idea-info w-100 pb-3 px-3">
    <div>
      <Typography class-name="border-bottom text-secondary d-block">
        Заказчик
      </Typography>

      <div class="idea-info__sub-info pt-2">
        <Icon class-name="bi bi-person-circle text-secondary fs-3 opacity-25" />

        <Typography class-name="text-primary">
          {{ idea.customer }}
        </Typography>
      </div>
    </div>

    <div>
      <Typography class-name="border-bottom text-secondary d-block">
        Инициатор
      </Typography>

      <div class="idea-info__sub-info pt-2">
        <Icon class-name="bi bi-envelope text-secondary fs-3 opacity-25" />

        <div
          class="idea-info__link text-primary"
          @click="navigateToProfileModal(idea.initiator.id)"
        >
          {{ idea.initiator.firstName }} {{ idea.initiator.lastName }}
        </div>
      </div>
    </div>

    <div v-if="getAccessToExpertsInfo()">
      <Typography class-name="border-bottom text-secondary d-block">
        Эксперты
      </Typography>

      <div
        v-for="{
          id,
          expertFirstName,
          expertLastName,
          rating,
          isConfirmed,
        } in expertRatings"
        :key="id"
        class="idea-info__sub-info pt-2"
      >
        <Icon :class-name="getExpertRatingicon(isConfirmed)" />

        <Typography class-name="text-primary">
          {{ `${expertFirstName} ${expertLastName}` }}
        </Typography>
        <Typography
          v-if="rating"
          :class-name="getRatingColor(rating)"
        >
          {{ rating.toFixed(1) }}
        </Typography>
      </div>
    </div>

    <div>
      <Typography class-name="border-bottom text-secondary d-block">
        Режим
      </Typography>

      <div class="idea-info__sub-info pt-2">
        <Icon class-name="bi bi-circle-fill text-success fs-3 opacity-50" />

        <Typography class-name="text-primary">
          {{ getModeButtonText() }}
        </Typography>
      </div>
    </div>

    <Button
      variant="primary"
      @click="copyLink"
    >
      {{ isCopiedLink ? 'Ссылка скопирована!' : 'Поделиться идеей' }}
    </Button>
  </div>
</template>

<style lang="scss" scoped>
.idea-info {
  @include flexible(stretch, flex-start, column, $gap: 16px);

  &__sub-info {
    @include flexible(center, flex-start, $gap: 8px);
  }

  &__link {
    cursor: pointer;

    &:hover {
      text-decoration: underline;
      text-underline-offset: 4px;
      text-decoration-thickness: 1px;
    }
  }
}
</style>
