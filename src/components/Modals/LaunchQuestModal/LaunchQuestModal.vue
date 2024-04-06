<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'

import Button from '@Components/Button/Button.vue'
import Typography from '@Components/Typography/Typography.vue'
import { LaunchQuestModalProps } from '@Components/Modals/LaunchQuestModal/LaunchQuestModal.type'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import useUserStore from '@Store/user/userStore'
import useQuestsStore from '@Store/quests/questsStore'
import IndicatorItem from '@Components/IndicatorItem/IndicatorItem.vue'
import useLaunchQuestStore from '@Store/launchQuests/launchQuestsStore'

const props = defineProps<LaunchQuestModalProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const questsStore = useQuestsStore()
const { quest } = storeToRefs(questsStore)

const launchQuestsStore = useLaunchQuestStore()
const { launchQuests } = storeToRefs(launchQuestsStore)

const router = useRouter()
const route = useRoute()

const isOpenedProfileModal = ref(true)

onMounted(async () => {
  const currentUser = user.value
  const idLaunchQuest = route.params.idLaunchQuest.toString()

  if (currentUser?.token) {
    const { token } = currentUser
    const launchQuest = launchQuests.value.find(
      (item) => item.idLaunchQuest == idLaunchQuest,
    )
    if (!launchQuest) return
    await questsStore.getQuest(launchQuest.idQuest, token)
  }
})

function handleCloseProfileModal() {
  return router.go(-1)
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpenedProfileModal"
    appear-on-render
    @on-outside-close="handleCloseProfileModal"
  >
    <div class="profile-modal p-3 overflow-y-scroll">
      <div class="w-100">
        <div class="profile-modal__header mb-3">
          <Button
            variant="primary"
            prepend-icon-name="bi bi-backspace-fill"
            @click="handleCloseProfileModal"
          >
            Назад
          </Button>

          <Typography
            class-name="p-2 w-100 bg-white rounded-3 fs-4 text-primary text-nowrap overflow-scroll-hidden"
            >{{ quest?.name ? quest?.name : 'Опрос' }}
          </Typography>
        </div>

        <div class="profile-modal__content">
          <div class="profile-modal__info mb-3">
            <div class="bg-white rounded-3 border p-3 gap-3 w-100">
              <div class="w-100 border-bottom pb-1">
                <Typography class-name="fs-5 text-primary">Описание:</Typography>
              </div>

              <div class="d-flex flex-column gap-3 mt-3">
                <p>{{ quest?.description }}</p>
              </div>
            </div>
          </div>

          <div class="profile-modal__info mb-3">
            <div class="bg-white rounded-3 border p-3 gap-3 w-100">
              <div class="w-100 border-bottom pb-1">
                <Typography class-name="fs-5 text-primary">Доступность:</Typography>
              </div>

              <div class="d-flex flex-column gap-3 mt-3">
                <p>{{ quest?.available ? 'Доступен' : 'Не доуступен' }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-3 border p-3 gap-3 w-100">
          <div class="w-100 border-bottom pb-1">
            <Typography class-name="fs-5 text-primary">Список вопросов:</Typography>
          </div>

          <div class="d-flex flex-wrap gap-3 mt-3 justify-content-between">
            <div
              class="w-49"
              v-for="indicator in quest?.indicators"
              :key="indicator.idIndicator"
            >
              <IndicatorItem :indicator="indicator" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.w-49 {
  width: 49%;
}

.profile-modal {
  position: relative;
  height: 100%;
  width: 80%;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
  background-color: #e9e9e9;

  @include flexible(
    column,
    $gap: 16px,
    $align-self: stretch,
    $justify-self: flex-end
  );

  transition: all 0.3s ease-out;

  &__placeholders {
    &-first {
      width: 33%;
      height: 100%;
      @include flexible(start, start, column, $gap: 16px);
    }

    &-second {
      width: 66%;
      height: 100%;
      @include flexible(start, start, column, $gap: 16px);
    }
  }

  &__header {
    @include flexible(stretch, flex-start, $gap: 16px);
  }

  &__content {
    width: 100%;
    @include flexible(stretch, flex-start, $gap: 16px);
  }

  &__info {
    width: 100%;
    height: 100%;

    @include flexible(center, flex-start, column, $gap: 16px);
  }
}

.modal-layout-enter-from .profile-modal,
.modal-layout-leave-to .profile-modal {
  transform: translateX(100%);
}
</style>
