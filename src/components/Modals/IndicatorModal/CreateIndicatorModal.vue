<script lang="ts" setup>
import Input from '@Components/Inputs/Input/Input.vue'
import Button from '@Components/Button/Button.vue'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import Select from '@Components/Inputs/Select/Select.vue'
import {
  IndicatorModalProps,
  IndicatorModalEmits,
} from '@Components/Modals/IndicatorModal/CreateIndicatorModal.type'
import { Indicator, IndicatorCategory, IndicatorType } from '@Domain/Quest'
import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import Validation from '@Utils/Validation'
import { OptionType } from '@Components/Inputs/Select/Select.types'
import useIndicatorStore from '@Store/indicators/indicatorsStore'
import { computed, onMounted, ref } from 'vue'
import RolesTypes from '@Domain/Roles'

const props = defineProps<IndicatorModalProps>()
const emit = defineEmits<IndicatorModalEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const indicatorStore = useIndicatorStore()
const { indicatorCategories } = storeToRefs(indicatorStore)

const { handleSubmit, values, setValues, setFieldError, validateField, resetField } =
  useForm<{
    name: string
    answers: string[]
    answer: string // этого поля нет в модели Indicator и оно нужно для добавления новых вариантов ответа
    toRole: IndicatorType
    fromRole: RolesTypes
    newCategoryName: string // этого поля нет в модели Indicator и оно нужно для добавления новых категорий
    categoryName: string
    idCategory: string
  }>({
    validationSchema: {
      name: (value: string) => Validation.checkIsEmptyValue(value),
      idCategory: (value: any) => Boolean(value),
      toRole: (value: string) => Validation.checkIsEmptyValue(value),
      fromRole: (value: string) => Validation.checkIsEmptyValue(value),
    },
  })

const answers = ref<string[]>([])

const computedIndicatorCategories = computed(() => {
  return indicatorCategories.value.map((category) => {
    return { value: category.idCategory, label: category.name } as OptionType
  })
})

const indicatorTypeSelectOptions: OptionType[] = [
  { value: 'TEAM', label: 'Оценка команды' },
  { value: 'INITIATOR', label: 'Оценка инициатора' },
  { value: 'MEMBER', label: 'Оценка членов команды' },
  { value: 'TEAM_LEADER', label: 'Оценка тимлида' },
  { value: 'TEACHER', label: 'Оценка преподавателя' },
]

const indicatorRoleSelectOptions: OptionType[] = [
  { value: 'MEMBER', label: 'Студент' },
  { value: 'INITIATOR', label: 'Инициатор' },
  { value: 'TEAM_LEADER', label: 'Тимлид' },
  { value: 'TEACHER', label: 'Преподаватель' },
]

const createIndicator = async () => {
  if (answers.value.length == 0) {
    setFieldError('answer', 'Добавьте варианты ответов')
    return
  }

  await handleSubmit(async (indicator) => {
    const newIndicator = {
      name: indicator.name,
      answers: answers.value,
      toRole: indicator.toRole,
      fromRole: indicator.fromRole,
      idCategory: values.idCategory,
    } as Indicator

    const categoryName = indicatorCategories.value.find(
      (category) => category.idCategory == values.idCategory,
    )?.name

    if (categoryName) {
      newIndicator.categoryName = categoryName
    }

    indicator.answers = answers.value

    const token = user.value?.token
    if (!token) return

    await indicatorStore.postIndicator(token, newIndicator)
    emit('close-modal')
  })()
}

const addAnswer = () => {
  const answer: string = values.answer
  if (!answer || answer.length == 0) {
    setFieldError('answer', 'Введите вариант ответа')
    return
  }
  answers.value.push(answer)
  setValues({ answer: '' })
}

const popAnswer = (answer: string) => {
  answers.value = answers.value.filter((a) => a != answer)
}

const postCategory = async () => {
  if (!values.newCategoryName || values.newCategoryName.length == 0) {
    setFieldError('newCategoryName', 'Введите название категории')
    return
  }
  validateField('newCategoryName')
  const token = user.value?.token
  if (!token) return

  const indicatorCategory = {
    name: values.newCategoryName,
  } as IndicatorCategory

  await indicatorStore.postIndicatorCategory(token, indicatorCategory)

  resetField('newCategoryName')
}

onMounted(async () => {
  const token = user.value?.token
  if (!token) return
  await indicatorStore.getIndicatorCategories(token)
})
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
  >
    <div class="modal-360-indicator bg-white rounded p-3 d-flex col">
      <div class="container-fluid d-flex">
        <div class="w-100">
          <div class="col-sm-12 d-flex align-items-center justify-content-between">
            <Typography class-name="fs-3 text-primary">Создание вопроса</Typography>
            <Button
              variant="close"
              class="close"
              @click="emit('close-modal')"
            />
          </div>
          <div class="row mt-3 d-flex">
            <div class="col-sm">
              <Input
                name="name"
                class-name="rounded"
                label="Название вопроса"
                placeholder="Название вопроса"
              />

              <Select
                name="idCategory"
                class-name="mt-0"
                label-class-name="mt-2"
                label="Категория вопроса"
                :options="computedIndicatorCategories"
              />
              <div class="mt-2"></div>
              <Typography class-name="text-primary"
                >Не нашли нужную категорию?</Typography
              >
              <div
                class="d-flex align-items-center justify-content-center gap-2 mt-2"
              >
                <Input
                  name="newCategoryName"
                  class-name="rounded mt-0"
                  placeholder="Новой категория"
                />
                <Button
                  class-name="bi bi-plus-lg p-2 rounded"
                  variant="primary"
                  @click="postCategory"
                />
              </div>
              <Select
                name="fromRole"
                class-name="mt-0"
                label-class-name="mt-2"
                label="Для кого предназначен вопрос"
                :options="indicatorRoleSelectOptions"
              />
              <Select
                name="toRole"
                class-name="mt-0"
                label-class-name="mt-2"
                label="Кого нужно оценить"
                :options="indicatorTypeSelectOptions"
              />
            </div>
            <div class="col-sm">
              <Typography class-name="text-primary">Варианты ответа</Typography>
              <div
                class="d-flex align-items-center justify-content-center gap-2 mt-2"
              >
                <Input
                  name="answer"
                  class-name="rounded"
                  placeholder="Вариант ответа"
                />
                <Button
                  class-name="bi bi-plus-lg p-2 rounded"
                  variant="primary"
                  @click="addAnswer"
                />
              </div>
              <div class="overflow-y w-100 h-75 mt-3">
                <div
                  v-for="answer in answers"
                  :key="answer"
                  class="p-1 rounded border d-flex justify-content-between align-items-center mt-3"
                >
                  <p class="m-0">{{ answer }}</p>
                  <Button
                    @click="popAnswer(answer)"
                    variant="close"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="align-self-end mt-auto">
        <Button
          class-name="magicNoWrap"
          variant="primary"
          @click="createIndicator"
          >Создать вопрос</Button
        >
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.modal-360-indicator {
  width: 50%;
  height: 70%;
  flex-direction: column !important;
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

.magicNoWrap {
  white-space: nowrap;
}

.overflow-y {
  overflow-y: scroll;
}
</style>
