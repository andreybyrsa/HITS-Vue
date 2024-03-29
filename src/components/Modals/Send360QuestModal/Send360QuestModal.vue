<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useMagicKeys, watchImmediate } from '@vueuse/core'

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
import { CheckedDataAction } from '@Components/Table/Table.types'
import profilesStore from '@Store/profiles/profilesStore'

const props = defineProps<Send360QuestProps>()
const emit = defineEmits<Send360QuestEmits>()

function close() {
  emit('close-modal')
}
function delQuestion(id: string) {
  const indexToRemove = selectedQuestions.value.findIndex(
    (question) => question.id === id,
  )

  // Если элемент найден, удаляем его из массива
  if (indexToRemove !== -1) {
    selectedQuestions.value.splice(indexToRemove, 1)
  }
}

const examplesNames = ['1', '2', '3']
const questions = ref([
  { id: '1', text: 'Какой смысл жизни?' },
  { id: '2', text: 'Что такое любовь?' },
  {
    id: '3',
    text: 'Как создать прекрасный обедвввввввввввввввввввввввввввввввввввввввввввввввввввввввв?',
  },
  { id: '4', text: 'Как приседать?' },
  { id: '5', text: 'Как отжиматься?' },
  { id: '6', text: 'Как бегать?' },
  { id: '7', text: 'Как ходить?' },
  { id: '8', text: 'Что думаешь о рептилоидах?' },
  { id: '9', text: 'Когда починят лифты?' },
  { id: '10', text: 'Хочешь питцы?' },
  {
    id: '11',
    text: 'Каковы современные тенденции в развитии и применении искусственного интеллекта в области медицины и здравоохранения, и какие перспективы предстоят в области диагностики, лечения, управления медицинскими данными и повышения эффективности медицинских процессов с использованием инновационных технологий и алгоритмов машинного обучения?',
  },
  // Добавьте больше вопросов по желанию
])

const selectedQuestions = ref<{ id: string; text: string }[]>([])

const showHidden = ref(false)
const checkedTeams = ref<Team[]>([])
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
    class="modal-360-quest"
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
                  name="customer"
                  label="Шаблон опроса"
                  :options="examplesNames"
                  placeholder="Выберите шаблон опроса"
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
                  class-name="rounded-end"
                  label="Описание опроса"
                  validate-on-update
                  placeholder=""
                  class="mt-3 max-height-textarea"
                ></Textarea>
              </div>
            </div>
          </div>
          <div class="col-sm-4">
            <div class="p-4">
              <Combobox
                v-model="selectedQuestions"
                :options="questions"
                :display-by="['text']"
                name="selectedQuestions"
                label="Выберите вопросы"
                placeholder="Начните вводить текст для поиска вопросов"
              />
              <div
                class="mt-3"
                v-if="selectedQuestions.length"
              >
                <Typography class-name="fs-6 text-primary"
                  >Выбранные вопросы:</Typography
                >
                <div class="overflow-auto">
                  <div
                    v-for="(question, index) in selectedQuestions"
                    :key="index"
                    class="p-2 mb-2 border rounded col-sm-12 d-flex align-items-center justify-content-between"
                    style="width: 100%"
                  >
                    <Typography
                      class-name="fs-6 "
                      style="overflow-wrap: break-word"
                      >{{ question.text }}</Typography
                    >

                    <Button
                      variant="close"
                      class="close ms-1 fixed-size-del-but"
                      @click="delQuestion(question.id)"
                    ></Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            data-bs-spy="scroll"
            class="col-sm-4"
          >
            {{ props.teams.map((item) => item.name) }}
            <!-- <div>
              <div
                class="send-ideas-on-market-modal__ideas d-flex flex-column gap-2 w-100"
              >
                <Typography class-name="w-100 text-primary">
                  {{
                    checkedIdeas.length === 1 ? 'Выбранная идея' : 'Выбранные идеи'
                  }}*
                </Typography>
                <div
                  v-for="(idea, index) in ideas"
                  :key="index"
                  class="d-flex gap-2 w-100"
                >
                  <Typography
                    class-name="send-ideas-on-market-modal__idea-name w-100 border rounded p-2"
                  >
                    {{ idea.name }}
                  </Typography>
                  <Button
                    variant="outline-danger"
                    append-icon-name="bi bi-x"
                    @click="resetIdea(idea.id)"
                  />
                </div>
              </div>
            </div> -->
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
  width: 90%;
  height: 900px;
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
  max-height: 43vh;
  resize: none !important;
  overflow: auto;
}

.fixed-size-del-but {
  width: 3vh; /* Задать желаемую ширину */
  height: 2vh; /* Задать желаемую высоту */
}
</style>
