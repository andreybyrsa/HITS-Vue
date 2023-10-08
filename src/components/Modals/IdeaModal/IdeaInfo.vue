<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'

import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import Collapse from '@Components/Collapse/Collapse.vue'
import { IdeaInfoProps } from '@Components/Modals/IdeaModal/IdeaModal.types'
import Button from '@Components/Button/Button.vue'
import useRatingStore from '@Store/rating/ratingStore'
import useUserStore from '@Store/user/userStore'
import modeButtons from './IdeaInfo.types'
import ModeButtonsType from './modeButtons.types'
import UsersGroup from '@Domain/UsersGroup'
import getStatus from '@Utils/getStatus'
import { Rating } from '@Domain/Idea'
import { watchImmediate } from '@vueuse/core'
import InitialState from '@Store/rating/initialState'
const props = defineProps<IdeaInfoProps>()
const status = getStatus()
const ratingStore = useRatingStore()
const { ratings } = storeToRefs(ratingStore)
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const expertRatings = ref<Rating[]>([])
function checkMode(mode: ModeButtonsType) {
  const currentRole = user.value?.role
  const currentStatusIdea = props.idea?.status
  const currentInitiatorIdea = props.idea?.initiator
  return currentRole == 'INITIATOR'
    ? currentRole &&
        currentStatusIdea &&
        currentInitiatorIdea == user.value?.email &&
        mode.roles.includes(currentRole) &&
        mode.status.includes(currentStatusIdea)
    : currentRole &&
        currentStatusIdea &&
        mode.roles.includes(currentRole) &&
        mode.status.includes(currentStatusIdea)
}

function checkViewMode() {
  const currentRole = user.value?.role
  const currentEmail = user.value?.email
  const currentInitiatorIdea = props.idea?.initiator
  const currentStatusIdea = props.idea?.status
  return currentRole == 'INITIATOR' &&
    currentEmail == currentInitiatorIdea &&
    (currentStatusIdea == 'NEW' || currentStatusIdea == 'ON_EDITING')
    ? false
    : currentRole == 'PROJECT_OFFICE' && currentStatusIdea == 'ON_APPROVAL'
    ? false
    : currentRole == 'EXPERT' && currentStatusIdea == 'ON_CONFIRMATION'
    ? false
    : currentRole == 'ADMIN'
    ? false
    : true
}

const disabled = ref<boolean>(false)

function button(id: string) {
  navigator.clipboard.writeText('http://localhost:8080/ideas/idea/' + id)
  disabled.value = true
}

watchImmediate(
  () => props.idea,
  async () => {
    const currentUser = user.value
    if (currentUser?.token && props.idea) {
      const { token } = currentUser
      const { id } = props.idea
      await ratingStore.fetchRatingsByIdeaId(id, token)
      const currentRatings = ratings.value.find(
        (item) => item.ideaId === id,
      )?.ratings
      if (currentRatings) {
        expertRatings.value = currentRatings
      }
    }
  },
)

const numberOfExperts = computed(() => {
  return expertRatings.value.filter((rating) => rating.expert).length
})
</script>

<template>
  <Typography
    v-if="idea"
    class-name="p-2 bg-primary rounded-top fs-4 text-center text-white"
  >
    {{ status.translatedStatus[idea.status] }}
  </Typography>

  <div class="idea-info w-100 pb-3 px-3">
    <div v-if="idea?.customer">
      <Typography class-name="border-bottom text-secondary d-block">
        Заказчик
      </Typography>

      <div class="idea-info__user pt-2">
        <Icon class-name="bi bi-person-circle text-secondary fs-2 opacity-25" />

        <Typography class-name="text-primary">
          {{ idea.customer }}
        </Typography>
      </div>
    </div>

    <div v-if="idea?.initiator">
      <Typography class-name="border-bottom text-secondary d-block">
        Инициатор
      </Typography>

      <div class="idea-info__user pt-2">
        <Icon class-name="bi bi-envelope text-secondary fs-2 opacity-25" />

        <Typography class-name="text-primary">
          {{ idea.initiator }}
        </Typography>
      </div>
    </div>

    <template
      v-for="mode in modeButtons"
      :key="mode.id"
    >
      <div v-if="checkMode(mode)">
        <Typography class-name="border-bottom text-secondary d-block">
          Режим
        </Typography>

        <div class="idea-info__user pt-2">
          <Icon :class-name="mode.iconClass" />

          <Typography class-name="text-primary"> {{ mode.text }} </Typography>
        </div>
      </div>
    </template>

    <div v-if="checkViewMode()">
      <Typography class-name="border-bottom text-secondary d-block">
        Режим
      </Typography>

      <div class="idea-info__user pt-2">
        <Icon class-name="bi bi-eye text-secondary fs-2 opacity-25" />

        <Typography class-name="text-primary"> Просмотр </Typography>
      </div>
    </div>

    <Button
      class-name="btn-primary w-100"
      @click="button(idea?.id as string)"
      :disabled="disabled"
      >{{ disabled ? 'Ссылка скопирована!' : 'Поделиться идеей' }}</Button
    >

    <div v-if="expertRatings">
      <div
        class="idea-info__experts border-bottom pointers"
        v-collapse="'experts'"
        aria-expanded="false"
      >
        <Typography class-name="text-secondary">Прогресс утверждения</Typography>

        <Icon class-name="bi bi-chevron-down me-2 fs-5 text-secondary" />
      </div>

      <Collapse id="experts">
        <div class="idea-modal__info-users py-2">
          <div
            v-for="(value, index) in expertRatings"
            :key="index"
            class="idea-info__user"
          >
            <Typography class-name="text-secondary">
              Всего экспертов: {{ numberOfExperts }}
            </Typography>
            <Typography class-name="text-primary">
              {{ value.expert ? 'Неизвестный эксперт' : '' }} -
              {{ value.confirmed ? 'Утвердил' : 'На утверждении' }}
            </Typography>
          </div>
        </div>
      </Collapse>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.idea-info {
  @include flexible(stretch, flex-start, column, $gap: 16px);

  &__user {
    @include flexible(center, flex-start, $gap: 8px);
  }

  &__users {
    @include flexible(stretch, flex-start, column, $gap: 8px);
  }

  &__experts {
    cursor: pointer;

    @include flexible(center, space-between);
  }
}
</style>
