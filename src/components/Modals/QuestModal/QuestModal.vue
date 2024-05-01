<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter, useRoute } from 'vue-router'

import Button from '@Components/Button/Button.vue'
import Select from '@Components/Inputs/Select/Select.vue'
import Typography from '@Components/Typography/Typography.vue'
import { LaunchQuestModalProps } from '@Components/Modals/QuestModal/QuestModal.type'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'

import useUserStore from '@Store/user/userStore'
import useQuestTemplatesStore from '@Store/questTemplates/questTemplatesStore'
import IndicatorItem from '@Components/IndicatorItem/IndicatorItem.vue'
import useQuestsStore from '@Store/quests/questsStore'
import { Quest } from '@Domain/Quest'
import useTeamStore from '@Store/teams/teamsStore'
import { OptionType } from '@Components/Inputs/Select/Select.types'
import { useForm } from 'vee-validate'

defineProps<LaunchQuestModalProps>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const questTemplatesStore = useQuestTemplatesStore()
const { questTemplate } = storeToRefs(questTemplatesStore)

const launchQuestsStore = useQuestsStore()
const { Quests: launchQuests } = storeToRefs(launchQuestsStore)
const launchQuest = ref<Quest>()

const teamsStore = useTeamStore()
const { teams } = storeToRefs(teamsStore)

const router = useRouter()
const route = useRoute()

const isOpenedProfileModal = ref(true)

const { handleSubmit, setValues, setFieldError } = useForm<{ available: boolean }>(
  {},
)

const changeAvailability = handleSubmit(async (model) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const available = model.available
    if (available == questTemplate.value?.available) {
      setFieldError('available', 'Значение должно отличаться от предыдущего')
    }
  }
})

onMounted(async () => {
  const currentUser = user.value
  const idLaunchQuest = route.params.idLaunchQuest.toString()

  if (currentUser?.token) {
    const { token } = currentUser
    await launchQuestsStore.getQuests(token)
    launchQuest.value = launchQuests.value.find(
      (item) => item.idQuest == idLaunchQuest,
    )
    if (!launchQuest.value) return
    await questTemplatesStore.getQuestTemplate(
      launchQuest.value.idQuestTemplate,
      token,
    )
    setValues({ available: launchQuest.value?.available })
    const teamsId = launchQuest.value.idTeams
    await teamsStore.getTeamsByIds(teamsId, token)
  }
})

const handleCloseProfileModal = () => {
  return router.go(-1)
}

const availableOptions: OptionType[] = [
  {
    value: true,
    label: 'Доступен',
  },
  {
    value: false,
    label: 'Не доступен',
  },
]

const computedRole = computed(() => {
  return user.value?.role
})

const computedQuestAvailability = computed(() => {
  return launchQuest.value?.available ? 'Открыт' : 'Скрыт'
})
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
            >{{ questTemplate?.name ? questTemplate?.name : 'Опрос' }}
          </Typography>
        </div>

        <div class="profile-modal__content">
          <div class="profile-modal__info mb-3">
            <div class="bg-white rounded-3 border p-3 gap-3 w-100">
              <div class="w-100 border-bottom pb-1">
                <Typography class-name="fs-5 text-primary"
                  >Дата начала и окончания:</Typography
                >
              </div>

              <div class="d-flex flex-column gap-3 mt-3">
                <p>{{ launchQuest?.startAt + ' - ' + launchQuest?.endAt }}</p>
              </div>
            </div>

            <div class="bg-white rounded-3 border p-3 gap-3 w-100">
              <div class="w-100 border-bottom pb-1">
                <Typography class-name="fs-5 text-primary">Описание:</Typography>
              </div>

              <div class="d-flex flex-column gap-3 mt-3">
                <p>{{ questTemplate?.description }}</p>
              </div>
            </div>
          </div>

          <div class="profile-modal__info mb-3">
            <div class="bg-white rounded-3 border p-3 gap-3 w-100">
              <div class="w-100 border-bottom pb-1">
                <Typography class-name="fs-5 text-primary"
                  >Название шаблона опроса:</Typography
                >
              </div>

              <div class="d-flex flex-column gap-3 mt-3">
                <p>{{ questTemplate?.name }}</p>
              </div>
            </div>
            <div class="bg-white rounded-3 border p-3 gap-3 w-100">
              <div class="w-100 border-bottom pb-1">
                <Typography class-name="fs-5 text-primary">Доступность:</Typography>
              </div>

              <div class="d-flex gap-3 mt-3">
                <p v-if="computedRole != 'PROJECT_OFFICE'">
                  {{ computedQuestAvailability }}
                </p>
                <div
                  class="d-flex justify-content-between w-100 gap-3"
                  v-else
                >
                  <Select
                    class-name="w-100"
                    name="available"
                    :options="availableOptions"
                  ></Select>

                  <Button
                    @click="changeAvailability"
                    variant="primary"
                    class-name="w-fit"
                    >Изменить</Button
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="computedRole == 'PROJECT_OFFICE'"
          class="bg-white rounded-3 border p-3 gap-3 w-100"
        >
          <div class="w-100 border-bottom pb-1">
            <Typography class-name="fs-5 text-primary">Список команд:</Typography>
          </div>

          <div class="d-flex flex-wrap gap-3 mt-3 justify-content-between">
            <div
              class="w-49"
              v-for="team in teams"
              :key="team.id"
            >
              <p>{{ team.name }}</p>
            </div>
          </div>
        </div>
        <div
          v-if="computedRole == 'PROJECT_OFFICE'"
          class="bg-white rounded-3 border p-3 gap-3 w-100 mt-3"
        >
          <div class="w-100 border-bottom pb-1">
            <Typography class-name="fs-5 text-primary">Список вопросов:</Typography>
          </div>

          <div class="d-flex flex-wrap gap-3 mt-3 justify-content-between">
            <div
              class="w-49"
              v-for="indicator in questTemplate?.indicators"
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
