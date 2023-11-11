<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'

import { MODE } from '@Main'

import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import { IdeaInfoProps } from '@Components/Modals/IdeaModal/IdeaModal.types'
import Button from '@Components/Button/Button.vue'

import useUserStore from '@Store/user/userStore'

import modeButtons from '@Components/Modals/IdeaModal/IdeaInfo.types'

import getStatus from '@Utils/getStatus'

const props = defineProps<IdeaInfoProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const route = useRoute()

const status = getStatus()

const isCopiedLink = ref(false)

function getModeButtonText() {
  const currentUser = user.value

  if (currentUser && currentUser.role) {
    const { email, role } = currentUser
    const { initiator, status } = props.idea

    const currentModeButton = modeButtons.find(
      (button) => button.roles.includes(role) && button.status.includes(status),
    )
    if (currentModeButton) return currentModeButton.text

    if ((status === 'NEW' || status === 'ON_EDITING') && email === initiator) {
      return 'Редактрирование'
    }

    return 'Просмотр'
  }
}

function copyLink() {
  const link =
    MODE === 'DEVELOPMENT'
      ? `http://localhost:8080${route.fullPath}`
      : `http://hits1${route.fullPath}`

  navigator.clipboard.writeText(link)
  isCopiedLink.value = true
  setTimeout(() => (isCopiedLink.value = false), 100000)
}

function getIdeaStatus() {
  const { idea, expertRatings } = props

  if (idea.status === 'ON_CONFIRMATION' && expertRatings) {
    const confirmedRatings = expertRatings.reduce(
      (prevValue, value) => (value.confirmed ? (prevValue += 1) : prevValue),
      0,
    )
    return `Утвердили ${confirmedRatings}/${expertRatings.length}`
  }

  return status.translatedStatus[idea.status]
}
</script>

<template>
  <Typography class-name="p-2 bg-primary rounded-top fs-4 text-center text-white">
    {{ getIdeaStatus() }}
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

        <Typography class-name="text-primary">
          {{ idea.initiator }}
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
}
</style>
