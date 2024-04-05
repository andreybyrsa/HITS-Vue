<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
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
  Send360QuestProps,
  Send360QuestEmits,
} from '@Components/Modals/Send360QuestModal/Send360QuestModal.type'
import { Team } from '@Domain/Team'
import { Quest, Indicator } from '@Domain/Quest'
import useQuestStore from '@Store/quests/questsStore'
import profilesStore from '@Store/profiles/profilesStore'
import { CheckedDataAction } from '@Components/Table/Table.types'
import useUserStore from '@Store/user/userStore'

const userStore = useUserStore()
const questStore = useQuestStore()

const { user } = storeToRefs(userStore)
const { questsLong: quests } = storeToRefs(questStore)

const props = defineProps<Send360QuestProps>()
const emit = defineEmits<Send360QuestEmits>()

onMounted(async () => {
  const token = user.value?.token
  if (token) {
    await questStore.getQuestsLong(token)
    templatesNames.value = quests.value.map((quest) => quest.name)
  }
})
const checkedTeams = ref<Team[]>([])
watchImmediate(
  () => props.teams,
  (value) => {
    if (value) {
      checkedTeams.value = value
    }
  },
  { deep: true },
)

const selectedTemplate = ref<string>()

const questions = computed(() => {
  if (selectedTemplate.value) {
    const choiseQuest = quests.value.filter(
      (quest) => selectedTemplate.value === quest.name,
    )[0]

    return choiseQuest.indicators
  } else {
    return []
  }
})

const templatesNames = ref<any[]>([])

const showHidden = ref(false)

function resetTeam(ideaId: string) {
  const ideaIndex = checkedTeams.value.findIndex(({ id }) => id === ideaId)

  if (ideaIndex !== -1) {
    checkedTeams.value.splice(ideaIndex, 1)

    if (checkedTeams.value.length === 0) emit('close-modal')
  }
}

function setExampleName(value: any) {
  selectedTemplate.value = value
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
                  v-model="selectedTemplate"
                  name="customer"
                  label="Шаблон опроса"
                  :options="templatesNames"
                  placeholder="Выберите шаблон опроса"
                  :on-on-select="setExampleName"
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

                <Textarea
                  name="deskruptionQuest"
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
              <Typography class-name="fs-6 text-primary">Вопросы:</Typography>
              <div
                class="mt-3"
                v-if="questions"
              >
                <div
                  class="overflow-scroll"
                  style="flex-grow: 1"
                >
                  <div
                    v-for="(question, index) in questions"
                    :key="index"
                    class="p-2 mb-2 border rounded col-sm-12 d-flex align-items-center justify-content-between"
                  >
                    <div class="text-question text-center">
                      <Typography class-name="">{{ question.value }}</Typography>
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
                  class="d-flex gap-2 w-100"
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
              @click="emit('close-modal')"
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
  height: 65%;
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
  resize: none !important;
}

.fixed-size-del-but {
  min-width: 5% !important; /* ширину */
}
.text-question {
  max-width: 95% !important; /* ширину */
  word-break: break-word !important;
}
</style>
