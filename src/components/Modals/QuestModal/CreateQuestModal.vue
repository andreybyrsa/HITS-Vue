<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'

import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import IndicatorItem from '@Components/IndicatorItem/IndicatorItem.vue'
import CreateIndicatorModal from '@Components/Modals/IndicatorModal/CreateIndicatorModal.vue'
import Icon from '@Components/Icon/Icon.vue'
import Typography from '@Components/Typography/Typography.vue'
import Input from '@Components/Inputs/Input/Input.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
import Button from '@Components/Button/Button.vue'
import {
  CreateQuestModalProps,
  CreateQuestModalEmits,
} from '@Components/Modals/QuestModal/CreateQuestModal.type'

import Validation from '@Utils/Validation'

import useUserStore from '@Store/user/userStore'

import useIndicatorStore from '@Store/indicators/indicatorsStore'
import { Indicator, Quest } from '@Domain/Quest'
import useQuestsStore from '@Store/quests/questsStore'

const props = defineProps<CreateQuestModalProps>()
const emit = defineEmits<CreateQuestModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const indicatorStore = useIndicatorStore()
const { indicators } = storeToRefs(indicatorStore)

const questStore = useQuestsStore()
const { quest } = storeToRefs(questStore)

const backlogIndicators = ref<Indicator[]>(indicators.value.slice())
const newQuestIndicators = ref<Indicator[]>(quest.value?.indicators ?? [])

const isOpenedCreateNewIndicator = ref(false)
const isLoading = ref<boolean>(false)

const { handleSubmit, setValues } = useForm<Quest>({
  validationSchema: {
    name: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    description: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
  },
})

onMounted(async () => {
  const token = user.value?.token
  if (!token) return
  const idQuest = props.idQuest
  await indicatorStore.getIndicators(token)
  if (idQuest) {
    await questStore.getQuest(idQuest, token)
    const questIndicators = quest.value?.indicators
    if (questIndicators) {
      newQuestIndicators.value = questIndicators
      backlogIndicators.value = indicators.value.filter((item) =>
        questIndicators.find((indicator) => indicator == item) ? true : false,
      )
    }
  } else {
    backlogIndicators.value = indicators.value
    newQuestIndicators.value = []
  }
})

watch(
  () => props.idQuest,
  async (idQuest) => {
    const token = user.value?.token
    if (!token || !idQuest) return
    await questStore.getQuest(idQuest, token)
    quest.value ? setValues({ ...quest.value }) : 1

    newQuestIndicators.value = indicators.value

    backlogIndicators.value.filter((newItem) => {
      return newQuestIndicators.value.indexOf(newItem) == -1
    })
  },
  { deep: true },
)

watch(
  () => indicators,
  (indicators) => {
    const newIndicators = indicators.value.filter((indicator) => {
      if (newQuestIndicators.value.find((item) => item == indicator)) return false
      if (backlogIndicators.value.find((item) => item == indicator)) return false
      return true
    })
    if (newIndicators) backlogIndicators.value.push(...newIndicators)
  },
  { deep: true },
)

const moveIndicatorToNew = (currentIndicator: Indicator) => {
  backlogIndicators.value = backlogIndicators.value.filter(
    (task) => task !== currentIndicator,
  )
  newQuestIndicators.value.push(currentIndicator)
}

const moveIndicatorToBacklog = (currentIndicator: Indicator) => {
  newQuestIndicators.value = newQuestIndicators.value.filter(
    (task) => task !== currentIndicator,
  )
  backlogIndicators.value.push(currentIndicator)
}

const CreateQuest = handleSubmit(async (quest) => {
  const currentUser = user.value

  if (currentUser?.token && quest) {
    const { token } = currentUser
    quest.indicators = newQuestIndicators.value
    await questStore.postQuest(quest, token)
    emit('close-modal')
  }
})

const openCreateNewIndicator = () => {
  isOpenedCreateNewIndicator.value = true
}

const closeCreateNewIndicator = () => {
  isOpenedCreateNewIndicator.value = false
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="modal-360-quest bg-white rounded px-4 py-3">
      <div class="sprint-form w-100 mb-1 h-100">
        <!-- header -->
        <div class="sprint-form__header w-100">
          <Typography class-name="fs-3 text-primary">
            Создание шаблона опроса
          </Typography>

          <Button
            variant="close"
            class="close"
            @click="emit('close-modal')"
          />
        </div>

        <!-- content -->
        <div class="d-flex gap-3 mt-1 w-100 h-75">
          <!-- tasks -->
          <div class="sprint-form__content-tasks d-flex gap-4">
            <!-- backlog -->
            <div class="d-flex flex-column w-100">
              <div class="sprint-form__backlog-name border-bottom">
                <Typography class-name="fs-5 text-secondary"
                  >Список вопросов</Typography
                >
                <Icon
                  class-name="bi bi-plus sprint-form__backlog-add p-1 rounded"
                  @click="openCreateNewIndicator"
                />
                <CreateIndicatorModal
                  @close-modal="closeCreateNewIndicator"
                  :isOpened="isOpenedCreateNewIndicator"
                ></CreateIndicatorModal>
              </div>
              <div class="d-flex flex-column mt-3 overflow-scroll h-100 gap-3 p-1">
                <IndicatorItem
                  class-name="cursor-pointer"
                  v-for="indicator in backlogIndicators"
                  :key="indicator.idIndicator"
                  @click="moveIndicatorToNew(indicator)"
                  :indicator="indicator"
                />
              </div>
            </div>

            <!-- new-sprint -->
            <div class="d-flex flex-column w-100">
              <div class="border-bottom">
                <Typography class-name="fs-5 text-secondary">
                  Выбранные вопросы
                </Typography>
              </div>
              <div class="d-flex flex-column mt-3 overflow-scroll h-100 gap-3 p-1">
                <IndicatorItem
                  class-name="cursor-pointer"
                  v-for="indicator in newQuestIndicators"
                  :key="indicator.idIndicator"
                  @click="moveIndicatorToBacklog(indicator)"
                  :indicator="indicator"
                />
              </div>
            </div>
          </div>

          <!-- form -->
          <div class="sprint-form__form d-flex flex-column gap-3 h-100">
            <!-- inputs -->
            <div class="d-flex flex-column gap-3 h-100">
              <Input
                name="name"
                class-name="rounded-end"
                label="Название опроса"
                validate-on-update
                placeholder="Введите название опроса"
              />
              <Textarea
                name="description"
                class-name="textarea rounded-end"
                label="Описание опроса"
                validate-on-update
                placeholder="Введите описание опроса"
              />
            </div>

            <!-- Кнопки -->
          </div>
        </div>
        <div class="align-self-end mt-auto">
          <Button
            variant="primary"
            @click="CreateQuest"
            :isLoading="isLoading"
          >
            Создать опрос
          </Button>
        </div>
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss">
.modal-360-quest {
  width: 85%;
  height: 900px;
  @include flexible(
    stretch,
    center,
    $align-self: center,
    $justify-self: center,
    $gap: 16px
  );

  transition: all $default-transition-settings;
}

.textarea {
  resize: none;
  height: 100px;
}

.sprint-form {
  @include flexible(flex-start, flex-start, column);
  overflow-y: scroll;

  &__header {
    @include flexible(center, space-between);
  }

  &__content {
    &-tasks {
      width: 70%;
      overflow-y: scroll;
    }
  }

  &__backlog {
    &-name {
      @include flexible(center, space-between);
    }

    &-add {
      transition: all linear 0.15s;
      -webkit-transition: all linear 0.15s;

      &:hover {
        cursor: pointer;
        color: white;
        background-color: rgb(13, 110, 253);
      }
    }
  }

  &__form {
    width: 30%;
  }
}
</style>
