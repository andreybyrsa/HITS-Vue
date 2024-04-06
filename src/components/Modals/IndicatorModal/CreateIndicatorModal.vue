<script lang="ts" setup>
import Input from '@Components/Inputs/Input/Input.vue'
import Textarea from '@Components/Inputs/Textarea/Textarea.vue'
import Button from '@Components/Button/Button.vue'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import Select from '@Components/Inputs/Select/Select.vue'
import {
  IndicatorModalProps,
  IndicatorModalEmits,
} from '@Components/Modals/IndicatorModal/CreateIndicatorModal.type'
import { Indicator } from '@Domain/Quest'
import useQuestsStore from '@Store/quests/questsStore'
import useUserStore from '@Store/user/userStore'
import { storeToRefs } from 'pinia'
import { useForm } from 'vee-validate'
import Validation from '@Utils/Validation'
import { OptionType } from '@Components/Inputs/Select/Select.types'
import useIndicatorStore from '@Store/indicators/indicatorsStore'

const props = defineProps<IndicatorModalProps>()
const emit = defineEmits<IndicatorModalEmits>()

const questStore = useQuestsStore()

const indicatorStore = useIndicatorStore()
const { indicators } = storeToRefs(indicatorStore)

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const { handleSubmit } = useForm<Indicator>({
  validationSchema: {
    value: (value: string) => Validation.checkIsEmptyValue(value),
    description: (value: string) => Validation.checkIsEmptyValue(value),
    category: (value: string) => Validation.checkIsEmptyValue(value),
    type: (value: string) => Validation.checkIsEmptyValue(value),
  },
})

const indicatorSelectOptions: OptionType[] = [
  { value: 'TEAM', label: 'Оценка команды' },
  { value: 'INITIATOR', label: 'Оценка инициатора' },
  { value: 'MEMBER', label: 'Оценка членов команды' },
  { value: 'TEAMLEAD', label: 'Оценка тимлида' },
]

const createIndicator = () => {
  handleSubmit(async (values) => {
    const indicator: Indicator = {
      idIndicator: (Math.random() * 1000).toString(),
      value: values.value,
      description: values.description,
      type: values.type,
      role: 'MEMBER',
      visible: true,
      category: 'soft',
    }
    const token = user.value?.token
    if (!token) return

    await indicatorStore.postIndicator(indicator, token)
    emit('close-modal')
  })()
}
</script>

<template>
  <ModalLayout
    :is-opened="isOpened"
    @on-outside-close="emit('close-modal')"
    class="modal-360-indicator"
  >
    <div class="modal-360-indicator bg-white rounded p-3">
      <div class="container-fluid d-flex flex-column">
        <div class="col-sm-12 d-flex align-items-center justify-content-between">
          <Typography class-name="fs-3 text-primary">Создание вопроса</Typography>
          <Button
            variant="close"
            class="close"
            @click="emit('close-modal')"
          ></Button>
        </div>
        <div class="row mt-3">
          <div class="col-sm-12">
            <Input
              name="value"
              class-name="rounded"
              label="Название вопроса"
              placeholder="Введите название опроса"
            />
            <Input
              name="category"
              label-class-name="rounded mt-3 "
              label="Категория вопроса"
              placeholder="Введите категорию опроса"
            />
            <Textarea
              name="description"
              class-name="rounded-end"
              label="Описание вопроса"
              placeholder=""
              class="mt-3 max-height-textarea"
            ></Textarea>
            <Select
              label="Тип вопроса"
              label-class-name="mt-3"
              name="type"
              :options="indicatorSelectOptions"
            ></Select>
          </div>
        </div>
        <div class="col-sm-12 d-flex justify-content-end mt-auto">
          <Button
            variant="primary"
            @click="createIndicator"
            >Создать вопрос</Button
          >
        </div>
      </div>
    </div>
  </ModalLayout>
</template>

<style lang="scss" scoped>
.modal-360-indicator {
  width: 400px;
  height: 600px;
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
@Components/Modals/QuestModal/QuestModal.type
