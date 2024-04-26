<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { watchImmediate } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import Input from '@Components/Inputs/Input/Input.vue'
import Combobox from '@Components/Inputs/Combobox/Combobox.vue'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'
import Button from '@Components/Button/Button.vue'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import {
  CreateLaunchQuestProps,
  CreateLaunchQuestEmits,
} from '@Components/Modals/LaunchQuestModal/CreateLaunchQuestModal.type'
import { Team } from '@Domain/Team'
import { LaunchQuest, Quest, QuestShort } from '@Domain/Quest'
import useQuestStore from '@Store/quests/questsStore'
import useUserStore from '@Store/user/userStore'
import Validation from '@Utils/Validation'
import { useForm } from 'vee-validate'
import useLaunchQuestStore from '@Store/launchQuests/launchQuestsStore'

const props = defineProps<CreateLaunchQuestProps>()
const emit = defineEmits<CreateLaunchQuestEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const questStore = useQuestStore()
const { quests, quest } = storeToRefs(questStore)

const launchQuestStore = useLaunchQuestStore()

const questTemplates = ref<QuestShort[]>([])
const selectedTeams = ref<Team[]>([])
const selectedQuestTemplate = ref<null | Quest>(null)

const { setValues, handleSubmit, values } = useForm<LaunchQuest>({
  validationSchema: {
    example: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Выберите шаблон опроса',
    idQuest: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Выберите шаблон опроса',
    idTeams: (value: string[]) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    name: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    startAt: (value: string) => Validation.checkDate(value) || 'Поле не заполнено',
    endAt: (value: string) =>
      Validation.validateDates(values.startAt, value) || 'Поле не заполнено',
  },
})

const handleCreateCompany = handleSubmit(async (values) => {
  const token = user.value?.token
  if (!token) return
  delete values.example

  await launchQuestStore.postLaunchQuest(values, token)
  emit('close-modal')
})

onMounted(async () => {
  const token = user.value?.token
  if (!token) return

  await questStore.getQuests(token)
  questTemplates.value = quests.value
})

watchImmediate(
  () => props.teams,
  (value) => {
    if (value) {
      selectedTeams.value = value
      selectedQuestTemplate.value = null
    }
  },
  { deep: true },
)

const questions = computed(() => {
  if (selectedQuestTemplate.value) {
    return quest.value?.indicators
  }
  return []
})

const resetTeam = (ideaId: string) => {
  const ideaIndex = selectedTeams.value.findIndex(({ id }) => id === ideaId)

  if (ideaIndex !== -1) {
    selectedTeams.value.splice(ideaIndex, 1)

    if (selectedTeams.value.length === 0) emit('close-modal')
  }
}

const setQuestTemplate = async (shortQuest: QuestShort) => {
  const token = user.value?.id
  const questId = shortQuest.idQuest
  if (!token || !questId) return

  const selectedQuest = await questStore.getQuest(questId, token)
  if (selectedQuest instanceof Error) return

  selectedQuestTemplate.value = selectedQuest

  const teamsId = selectedTeams.value.map((team) => team.id)
  setValues({ idQuest: selectedQuest.idQuest, idTeams: teamsId })
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="modal-360-quest bg-white rounded p-3">
      <div class="container-fluid d-flex flex-column">
        <div class="row">
          <div class="col-sm-12 d-flex align-items-center justify-content-between">
            <Typography class-name="fs-3 text-primary">Создание опроса</Typography>

            <Button
              variant="close"
              class="close"
              @click="emit('close-modal')"
            ></Button>
          </div>
        </div>
        <div class="row flex-grow-2">
          <div class="col-sm-4">
            <div class="p-4">
              <div class="w-100">
                <Combobox
                  name="example"
                  label="Шаблон опроса"
                  :options="questTemplates"
                  :displayBy="['name']"
                  placeholder="Выберите шаблон опроса"
                  @on-select="setQuestTemplate"
                  validate-on-update
                />
                <Checkbox
                  name="showHidden"
                  label="Показать скрытые"
                  class="mt-1"
                />
                <div>
                  <Input
                    name="name"
                    class-name="rounded-end"
                    class="mt-3"
                    label="Название опроса"
                    validate-on-update
                    placeholder="Введите название опроса"
                  />
                </div>
                <div
                  class="classcol-sm-12 d-flex align-items-center justify-content-between mt-3"
                >
                  <Input
                    name="startAt"
                    class-name="rounded-end "
                    class="me-2"
                    label="Дата начала"
                    type="date"
                    validate-on-update
                    placeholder=".. | .. | .."
                  />
                  <Input
                    name="endAt"
                    class-name="rounded-end "
                    label="Дата окончания"
                    type="date"
                    validate-on-update
                    placeholder=".. | .. | .."
                    class="ms-2"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="p-4">
              <Typography class-name="fs-6 text-primary ">Вопросы:</Typography>
              <div
                class="mt-3"
                v-if="questions?.length"
              >
                <div
                  class="overflow-scroll fixed-size-scroll-div"
                  style="flex-grow: 1"
                >
                  <div
                    v-for="(question, index) in questions"
                    :key="index"
                    class="p-2 mb-2 border rounded col-sm-12 d-flex align-items-center justify-content-between"
                  >
                    <div class="">
                      <Typography class-name="">{{ question.name }}</Typography>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="mt-1"
                v-else
              >
                <div class="text-center p-2 mb-2 border rounded col-sm-12">
                  <Typography class-name="">Шаблон ещё не выбран</Typography>
                </div>
              </div>
            </div>
          </div>
          <div
            data-bs-spy="scroll"
            class="col-sm-4"
          >
            <div>
              <div class="d-flex flex-column gap-2 w-100 p-4">
                <Typography class-name="fs-6 text-primary">
                  {{
                    selectedTeams.length === 1
                      ? 'Выбранная команда'
                      : 'Выбранные команды'
                  }}
                </Typography>
                <div
                  v-for="(team, index) in teams"
                  :key="index"
                  class="d-flex gap-2 w-100 fixed-size-scroll-div"
                >
                  <Typography
                    class-name="send-ideas-on-market-modal__idea-name w-100 border rounded p-2"
                  >
                    {{ team.name }}
                  </Typography>
                  <Button
                    variant="outline-danger"
                    append-icon-name="bi bi-x"
                    @click="resetTeam(team.id)"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row mt-auto justify-content-end">
          <div class="col-sm-12 d-flex justify-content-end">
            <Button
              variant="primary"
              @click="handleCreateCompany"
              >Создать опрос</Button
            >
          </div>
        </div>
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.modal-360-quest {
  width: 80%;
  height: 85%;
  @include flexible(
    stretch,
    flex-start,
    $align-self: center,
    $justify-self: center,
    $gap: 16px
  );

  transition: all $default-transition-settings;

  &__header {
    @include flexible(center, space-between);
  }
}

.max-height-textarea {
  resize: none;
}

.fixed-size-scroll-div {
  max-height: 55vh !important; /* ширину */
}
.text-question {
  word-break: break-word !important;
}
</style>
