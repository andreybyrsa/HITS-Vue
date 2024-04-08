<script lang="ts" setup>
import { computed, onMounted, ref, toValue, watch } from 'vue'
import { useMagicKeys, watchImmediate } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import Input from '@Components/Inputs/Input/Input.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
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
import { Quest, Indicator, QuestShort } from '@Domain/Quest'
import useQuestStore from '@Store/quests/questsStore'
import profilesStore from '@Store/profiles/profilesStore'
import { CheckedDataAction } from '@Components/Table/Table.types'
import useUserStore from '@Store/user/userStore'
import Validation from '@Utils/Validation'
import { useForm } from 'vee-validate'

const userStore = useUserStore()
const questStore = useQuestStore()
const { user } = storeToRefs(userStore)
const { quests, quest } = storeToRefs(questStore)
const props = defineProps<CreateLaunchQuestProps>()
const emit = defineEmits<CreateLaunchQuestEmits>()

const questTemplates = ref<QuestShort[]>([])
const checkedTeams = ref<Team[]>([])
const selectedQuestTemplate = ref()

const showHidden = ref(false)

onMounted(async () => {
  const token = user.value?.token
  if (token) {
    await questStore.getQuests(token)
    questTemplates.value = quests.value
  }
})
watchImmediate(
  () => props.teams,
  (value) => {
    if (value) {
      checkedTeams.value = value
      selectedQuestTemplate.value = null
    }
  },
  { deep: true },
)
watchImmediate(
  () => quest.value,
  (value) => {
    if (value) {
      descriptionQuest.value = quest.value?.description
    }
    quest.value ? setValues({ ...quest.value }) : 1
  },
)
const questions = computed(() => {
  if (selectedQuestTemplate.value) {
    const token = user.value?.token
    const idQuest = selectedQuestTemplate.value.idQuest
    if (!token) return
    questStore.getQuest(idQuest, token)
    return quest.value?.indicators
  }
  return []
})
const descriptionQuest = ref()
function resetTeam(ideaId: string) {
  const ideaIndex = checkedTeams.value.findIndex(({ id }) => id === ideaId)

  if (ideaIndex !== -1) {
    checkedTeams.value.splice(ideaIndex, 1)

    if (checkedTeams.value.length === 0) emit('close-modal')
  }
}

function setExample(value: any) {
  selectedQuestTemplate.value = value
}

const { setValues, handleSubmit } = useForm<Quest>({
  validationSchema: {
    example: (value: QuestShort) =>
      Validation.checkIsEmptyValue(value) || 'Выберите шаблон опроса',
    name: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    description: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    startDate: (value: Date) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    finishDate: (value: Date) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
  },
})

const handleCreateCompany = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token && quest) {
    const { token } = currentUser
    console.log(1)
    emit('close-modal')
  }
})
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
                  v-model="selectedQuestTemplate"
                  name="example"
                  label="Шаблон опроса"
                  :options="questTemplates"
                  :displayBy="['name']"
                  placeholder="Выберите шаблон опроса"
                  :on-on-select="setExample"
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
                    name="startDate"
                    class-name="rounded-end "
                    class="me-2"
                    label="Дата начала"
                    type="date"
                    validate-on-update
                    placeholder=".. | .. | .."
                  />
                  <Input
                    name="finishDate"
                    class-name="rounded-end "
                    label="Дата окончания"
                    type="date"
                    validate-on-update
                    placeholder=".. | .. | .."
                    class="ms-2"
                  />
                </div>
                {{ descriptionQuest }}
                <Textarea
                  :v-model="descriptionQuest"
                  name="description"
                  class-name="rounded-end max-height-textarea"
                  label="Описание опроса"
                  validate-on-update
                  placeholder="Введите описание опроса"
                  class="mt-3"
                />
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
                    checkedTeams.length === 1
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
