<script lang="ts" setup>
import { onMounted, ref } from 'vue'

import Input from '@Components/Inputs/Input/Input.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
import Button from '@Components/Button/Button.vue'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import CreateIndicatorModal from '@Components/Modals/CreateIndicatorModal/CreateIndicatorModal.vue'
import Typography from '@Components/Typography/Typography.vue'
import Icon from '@Components/Icon/Icon.vue'
import {
  QuestModalProps,
  QuestModalEmits,
} from '@Components/Modals/CreateQuestModal/CreateQuestModal.type'
import { Indicator, Quest } from '@Domain/Quest'
import useQuestsStore from '@Store/quests/questsStore'
import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import Validation from '@Utils/Validation'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'
import useIndicatorStore from '@Store/indicators/indicatorsStore'

const props = defineProps<QuestModalProps>()
const emit = defineEmits<QuestModalEmits>()

const selectedQuestions = ref<Indicator[]>([])
const isIndicatorModalOpen = ref(false)

const questStore = useQuestsStore()
const { quest } = storeToRefs(questStore)

const indicatorStore = useIndicatorStore()
const { indicators } = storeToRefs(indicatorStore)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

onMounted(async () => {
  const token = user.value?.token
  const idQuest = props.idQuest
  if (!token) return
  await indicatorStore.getIndicators(token)
  if (idQuest) {
    await questStore.getQuest(idQuest, token)

    await setValues({
      name: quest.value?.name + ' - копия',
      description: quest.value?.description,
    })
    // if (quest.value) selectedQuestions.value = quest.value.indicators
  } else {
    setValues({ name: '', description: '' })
  }
})

const { handleSubmit, setValues } = useForm<Quest>({
  validationSchema: {
    name: (value: string) => Validation.checkIsEmptyValue(value),
    description: (value: string) => Validation.checkIsEmptyValue(value),
  },
})

const delQuestion = (id: string) => {
  const indexToRemove = selectedQuestions.value.findIndex(
    (question) => question.idIndicator === id,
  )

  if (indexToRemove !== -1) {
    selectedQuestions.value.splice(indexToRemove, 1)
  }
}

const sendQuest = () => {
  handleSubmit(() => {
    emit('close-modal')
  })()
}

const openIndicatorModal = () => {
  isIndicatorModalOpen.value = true
}

const closeIndicatorModal = () => {
  isIndicatorModalOpen.value = false
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
    class="modal-360-quest"
  >
    <div class="modal-360-quest bg-white rounded p-3">
      <div class="container-fluid d-flex flex-column">
        <div class="col-sm-12 d-flex align-items-center justify-content-between">
          <Typography class-name="fs-3 text-primary">Создание опроса</Typography>
          <Button
            variant="close"
            class="close"
            @click="emit('close-modal')"
          ></Button>
        </div>
        <div class="row mt-3 h-75">
          <div class="col-sm-6">
            <Input
              name="name"
              class-name="rounded-end"
              class=""
              label="Название опроса"
              placeholder="Введите название опроса"
            />
            <Textarea
              name="description"
              class-name="rounded-end"
              label="Описание опроса"
              placeholder=""
              class="mt-3 max-height-textarea"
            ></Textarea>
          </div>

          <div class="col-sm-6 h-100">
            <div class="d-flex justify-content-start gap-3">
              <Typography class-name="fs-6 text-primary"
                >Выбранные вопросы:</Typography
              >
              <Icon
                @click="openIndicatorModal"
                className="bi bi-plus-circle cursor-pointer text-secondary"
              />
              <CreateIndicatorModal
                @close-modal="closeIndicatorModal"
                :isOpened="isIndicatorModalOpen"
              ></CreateIndicatorModal>
            </div>

            <div class="overflow-scroll p-2 h-100">
              <div
                v-for="(question, index) in indicators"
                :key="index"
                class="p-2 mb-2 border rounded col-sm-12 d-flex align-items-center justify-content-between"
                style="width: 100%"
              >
                <Typography
                  class-name="fs-6 "
                  style="overflow-wrap: break-word"
                  >{{ question.value }}</Typography
                >
                <Checkbox
                  class-name=""
                  :name="question.idIndicator"
                ></Checkbox>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-12 d-flex justify-content-end mt-auto">
          <Button
            variant="primary"
            @click="sendQuest()"
            >Создать опрос</Button
          >
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
