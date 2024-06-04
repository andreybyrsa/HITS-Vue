<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
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
} from '@Components/Modals/QuestTemplateModal/CreateQuestTemplateModal.type'

import Validation from '@Utils/Validation'

import useUserStore from '@Store/user/userStore'

import useIndicatorStore from '@Store/indicators/indicatorsStore'
import useQuestTemplatesStore from '@Store/questTemplates/questTemplatesStore'
import { findStatusesByTranslatedStatus } from '@Utils/indicatorStatus'
import { Indicator, QuestTemplate } from '@Domain/Quest'

const props = defineProps<CreateQuestModalProps>()
const emit = defineEmits<CreateQuestModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const indicatorStore = useIndicatorStore()
const { indicators } = storeToRefs(indicatorStore)

const questTemplatesStore = useQuestTemplatesStore()
const { questTemplate } = storeToRefs(questTemplatesStore)

const backlogIndicators = ref<Indicator[]>(indicators.value.slice())
const newQuestIndicators = ref<Indicator[]>(questTemplate.value?.indicators ?? [])

const isOpenedCreateNewIndicator = ref(false)
const isLoading = ref<boolean>(false)

const { handleSubmit, setValues, values } = useForm<{
  name: string
  description: string
  backlogSearchValue: string
  newQuestSearchValue: string
}>({
  validationSchema: {
    name: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    description: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
  },
})

const filteredBacklogIndicators = computed(() => {
  const searchValue = values.backlogSearchValue
  if (!searchValue) return backlogIndicators.value
  searchValue.toLowerCase()

  return backlogIndicators.value.filter(
    (indicator) =>
      indicator.name.toLowerCase().includes(searchValue) ||
      findStatusesByTranslatedStatus(searchValue).includes(indicator.toRole),
  )
})

const filteredNewQuestIndicators = computed(() => {
  const searchValue = values.newQuestSearchValue
  if (!searchValue) return newQuestIndicators.value
  searchValue.toLowerCase()

  return newQuestIndicators.value.filter(
    (indicator) =>
      indicator.name.toLowerCase().includes(searchValue) ||
      findStatusesByTranslatedStatus(searchValue).includes(indicator.toRole),
  )
})

onMounted(async () => {
  await orderIndicatorsToLists()
})

watch(
  () => props.isOpened,
  async () => {
    await orderIndicatorsToLists()
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

const orderIndicatorsToLists = async () => {
  const token = user.value?.token
  if (!token) return
  await indicatorStore.getIndicators(token)
  const id = props.id
  if (id) {
    await questTemplatesStore.getQuestTemplate(id, token)
    if (!questTemplate.value) return
    setValues({ ...questTemplate.value })
    setValues({ name: questTemplate.value.name + ' - копия' })
    const copiedIndicators = questTemplate.value.indicators
    newQuestIndicators.value = copiedIndicators

    backlogIndicators.value = indicators.value.filter((indicator) =>
      copiedIndicators.find((copy) => indicator.idIndicator == copy.idIndicator)
        ? false
        : true,
    )
  } else {
    backlogIndicators.value = indicators.value
    newQuestIndicators.value = []
  }
}

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

const createQuest = handleSubmit(async (values) => {
  const currentUser = user.value

  if (currentUser?.token) {
    const { token } = currentUser

    const newQuest = {
      name: values.name,
      description: values.description,
      indicators: newQuestIndicators.value,
    } as QuestTemplate

    await questTemplatesStore.postQuestTemplate(newQuest, token)
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
    <div class="modal-360-questTemplate bg-white rounded px-4 py-3">
      <div class="quest-form w-100 mb-1 h-100">
        <!-- header -->
        <div class="quest-form__header w-100">
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
          <div class="quest-form__content-tasks d-flex gap-4">
            <!-- backlog -->
            <div class="d-flex flex-column w-100">
              <div class="quest-form__backlog-name border-bottom">
                <Typography class-name="fs-5 text-secondary"
                  >Список вопросов</Typography
                >
                <Icon
                  class-name="bi bi-plus quest-form__backlog-add p-1 rounded"
                  @click="openCreateNewIndicator"
                />
                <CreateIndicatorModal
                  @close-modal="closeCreateNewIndicator"
                  :isOpened="isOpenedCreateNewIndicator"
                ></CreateIndicatorModal>
              </div>
              <Input
                placeholder="Введите название вопроса или его тип"
                class-name="rounded m-1 mt-3 mb-2"
                name="backlogSearchValue"
              />
              <div class="d-flex flex-column mt-3 overflow-y h-100 gap-3 p-1">
                <IndicatorItem
                  class-name="cursor-pointer"
                  v-for="indicator in filteredBacklogIndicators"
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
              <Input
                placeholder="Введите название вопроса или его тип"
                class-name="rounded m-1 mt-3 mb-2"
                name="newQuestSearchValue"
              />
              <div class="d-flex flex-column mt-3 overflow-y h-100 gap-3 p-1">
                <IndicatorItem
                  class-name="cursor-pointer"
                  v-for="indicator in filteredNewQuestIndicators"
                  :key="indicator.idIndicator"
                  @click="moveIndicatorToBacklog(indicator)"
                  :indicator="indicator"
                />
              </div>
            </div>
          </div>

          <!-- form -->
          <div class="quest-form__form d-flex flex-column gap-3 h-100">
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
            @click="createQuest"
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
.modal-360-questTemplate {
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

.overflow-y {
  overflow-y: scroll;
}

.quest-form {
  @include flexible(flex-start, flex-start, column);

  &__header {
    @include flexible(center, space-between);
  }

  &__content {
    &-tasks {
      width: 70%;
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
