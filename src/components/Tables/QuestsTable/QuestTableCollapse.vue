<script lang="ts" setup>
import { computed, defineProps, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'

import useUserStore from '@Store/user/userStore'
import useQuestTemplatesStore from '@Store/questTemplates/questTemplatesStore'
import useQuestsStore from '@Store/quests/questsStore'
import useTeamStore from '@Store/teams/teamsStore'
import { Quest } from '@Domain/Quest'
import { Team } from '@Domain/Team'

import Button from '@Components/Button/Button.vue'
import Select from '@Components/Inputs/Select/Select.vue'
import IndicatorItem from '@Components/IndicatorItem/IndicatorItem.vue'
import Table from '@Components/Table/Table.vue'
import {
  DropdownMenuAction,
  TableColumn,
  TableHeader,
} from '@Components/Table/Table.types'
import {
  TableCollapse,
  TeamlCollapseData,
  MembersCollapseData,
} from '@Components/Tables/QuestsTable/QuestTableCollapse.types'

import { OptionType } from '@Components/Inputs/Select/Select.types'

const props = defineProps<TableCollapse>()
const QuestData = ref<Quest>(props.data)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const questsTemplatesStore = useQuestTemplatesStore()
const { questTemplate: quest } = storeToRefs(questsTemplatesStore)

const questsStore = useQuestsStore()
const { quests: quests } = storeToRefs(questsStore)

const teamsStore = useTeamStore()
const { teams } = storeToRefs(teamsStore)

const collapseData = ref<TeamlCollapseData[]>()

const computedQuest = computed(() => {
  if (!user.value?.token) return
  if (!QuestData.value.idQuestTemplate) return
  questsTemplatesStore.getQuestTemplate(
    QuestData.value.idQuestTemplate,
    user.value.token,
  )
  return quest
})
const computedRole = computed(() => {
  return user.value?.role
})
const computedQuestAvailability = computed(() => {
  return QuestData.value.available ? 'Открыт' : 'Завершен'
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
//getQuestPercent
const TableColumns = computed((): TableColumn<TeamlCollapseData>[] => {
  const columns: TableColumn<TeamlCollapseData>[] = [
    {
      key: 'teamName',
    },
    {
      key: 'teamProgress',
    },
  ]
  return columns
})

const dropdownActionsMenu: DropdownMenuAction<Team>[] = [
  {
    label: 'string',
    click: (value) => {
      1
    },
  },
]

onMounted(async () => {
  const currentUser = user.value
  if (!currentUser?.token) return

  const { token } = currentUser
  const idTeams = QuestData.value.idTeams
  const response = await teamsStore.getTeamsByIds(idTeams, token)
  if (response instanceof Error) return

  const teamsNames = response.map((team) => team.name)

  if (!collapseData.value) return

  for (let i = 0; i < teamsNames.length; i++)
    collapseData.value[i].teamName = teamsNames[i]
})
</script>

<template>
  <div class="ms-5 border">
    <!-- <Table
      v-if="collapseData"
      :data="collapseData"
      :columns="TableColumns"
      :dropdownActionsMenu="dropdownActionsMenu"
    >
    </Table> -->
  </div>

  <!-- <template>
    <Table
      class-name="ms-5"
      data
    >
    </Table>
  </template> -->
  <!-- <div class="w-100 m-0 p-0">
    <div>
      <Typography
        >{{ computedQuest?.value?.name ? computedQuest?.value.name : 'Опрос' }}
      </Typography>
    </div>

    <div>
      <div>
        <Typography>Дата начала и окончания:</Typography>
      </div>

      <div>
        <p>{{ data?.startAt + ' - ' + data?.endAt }}</p>
      </div>
    </div>

    <div>
      <div>
        <Typography>Описание:</Typography>
      </div>

      <div>
        <p>{{ computedQuest?.value?.description }}</p>
      </div>
    </div>

    <div>
      <div>
        <Typography>Название шаблона опроса:</Typography>
      </div>

      <div>
        <p>{{ quest?.name }}</p>
      </div>
    </div>

    <div>
      <div>
        <Typography>Доступность:</Typography>
      </div>

      <div>
        <p v-if="computedRole != 'PROJECT_OFFICE'">
          {{ computedQuestAvailability }}
        </p>
        <div v-else>
          <Select
            name="available"
            :options="availableOptions"
          ></Select>

          <Button
            @click="changeAvailability"
            variant="primary"
            >Изменить</Button
          >
        </div>
      </div>
    </div>

    <div v-if="computedRole == 'PROJECT_OFFICE'">
      <div>
        <Typography>Общий список команд:</Typography>
      </div>

      <div>
        <div
          v-for="team in teams"
          :key="team.id"
        >
          <p>{{ team.name }}</p>
        </div>
      </div>
    </div>

    <div v-if="computedRole == 'PROJECT_OFFICE'">
      <div>
        <Typography>Список вопросов:</Typography>
      </div>

      <div v-if="computedQuest?.value">
        <div
          v-for="indicator in computedQuest?.value.indicators"
          :key="indicator.idIndicator"
        >
          <IndicatorItem :indicator="indicator" />
        </div>
      </div>
    </div>
  </div> -->
</template>

<style></style>
