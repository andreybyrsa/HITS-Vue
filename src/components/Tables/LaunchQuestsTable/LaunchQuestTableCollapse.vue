<script lang="ts" setup>
import { computed, defineProps, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'

import useUserStore from '@Store/user/userStore'
import useQuestsStore from '@Store/quests/questsStore'
import useLaunchQuestStore from '@Store/launchQuests/launchQuestsStore'
import useTeamStore from '@Store/teams/teamsStore'

import Button from '@Components/Button/Button.vue'
import Select from '@Components/Inputs/Select/Select.vue'
import { TableCollapse } from '@Components/Tables/LaunchQuestsTable/LaunchQuestTableCollapse.types'
import { LaunchQuest, Quest } from '@Domain/Quest'
import { OptionType } from '@Components/Inputs/Select/Select.types'
import IndicatorItem from '@Components/IndicatorItem/IndicatorItem.vue'

onMounted(() => {
  setValues({ available: LaunchQuestData.available })
})

const props = defineProps<TableCollapse>()
const LaunchQuestData: LaunchQuest = props.data as LaunchQuest

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const questsStore = useQuestsStore()
const { quest } = storeToRefs(questsStore)

const launchQuestsStore = useLaunchQuestStore()
const { launchQuests } = storeToRefs(launchQuestsStore)

const teamsStore = useTeamStore()
const { teams } = storeToRefs(teamsStore)

const computedQuest = computed(() => {
  if (!user.value?.token) return
  if (!LaunchQuestData.idQuest) return
  questsStore.getQuest(LaunchQuestData.idQuest, user.value.token)
  return quest
})
const computedRole = computed(() => {
  return user.value?.role
})
const computedQuestAvailability = computed(() => {
  return LaunchQuestData.available ? 'Открыт' : 'Завершен'
})

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
const { handleSubmit, setValues, setFieldError } = useForm<{ available: boolean }>(
  {},
)
const changeAvailability = handleSubmit(async (model) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser
    const available = model.available
    if (available == quest.value?.available) {
      setFieldError('available', 'Значение должно отличаться от предыдущего')
    }
  }
})
</script>

<template>
  <div class="w-100 m-0 p-0">
    <div class="mb-3">
      <Typography
        class-name="p-2 w-100 bg-white rounded-3 fs-4 text-primary text-nowrap overflow-scroll-hidden"
        >{{ computedQuest?.value?.name ? computedQuest?.value.name : 'Опрос' }}
      </Typography>
    </div>

    <div class="">
      <div class="mb-3">
        <div class="bg-white rounded-3 border p-3 gap-3 w-100">
          <div class="w-100 border-bottom pb-1">
            <Typography class-name="fs-5 text-primary"
              >Дата начала и окончания:</Typography
            >
          </div>

          <div class="d-flex flex-column gap-3 mt-3">
            <p>{{ data?.startAt + ' - ' + data?.endAt }}</p>
          </div>
        </div>

        <div class="bg-white rounded-3 border p-3 gap-3 w-100">
          <div class="w-100 border-bottom pb-1">
            <Typography class-name="fs-5 text-primary">Описание:</Typography>
          </div>

          <div class="d-flex flex-column gap-3">
            <p>{{ computedQuest?.value?.description }}</p>
          </div>
        </div>
      </div>

      <div class="">
        <div class="bg-white rounded-3 border p-3 gap-3 w-100">
          <div class="w-100 border-bottom pb-1">
            <Typography class-name="fs-5 text-primary"
              >Название шаблона опроса:</Typography
            >
          </div>

          <div class="d-flex flex-column gap-3 mt-3">
            <p>{{ quest?.name }}</p>
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

      <div
        class="d-flex flex-wrap gap-3 mt-3 justify-content-between"
        v-if="computedQuest?.value"
      >
        <div
          class="w-49"
          v-for="indicator in computedQuest?.value.indicators"
          :key="indicator.idIndicator"
        >
          <IndicatorItem :indicator="indicator" />
        </div>
      </div>
    </div>
  </div>
</template>
