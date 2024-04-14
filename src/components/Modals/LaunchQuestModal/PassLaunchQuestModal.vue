<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import { watchImmediate } from '@vueuse/core'
import { storeToRefs } from 'pinia'

import Combobox from '@Components/Inputs/Combobox/Combobox.vue'
import Checkbox from '@Components/Inputs/Checkbox/Checkbox.vue'
import Button from '@Components/Button/Button.vue'
import ModalLayout from '@Layouts/ModalLayout/ModalLayout.vue'
import Typography from '@Components/Typography/Typography.vue'
import {
  PassLaunchQuestProps,
  PassLaunchQuestEmits,
} from '@Components/Modals/LaunchQuestModal/PassLaunchQuestModal.type'
import { Team } from '@Domain/Team'
import { Quest, QuestShort } from '@Domain/Quest'
import useQuestStore from '@Store/quests/questsStore'
import useUserStore from '@Store/user/userStore'
import Validation from '@Utils/Validation'
import { useForm } from 'vee-validate'

const props = defineProps<PassLaunchQuestProps>()
const emit = defineEmits<PassLaunchQuestEmits>()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const questStore = useQuestStore()
const { quest } = storeToRefs(questStore)

watch(
  () => props.launchQuest,
  async () => {
    const token = user.value?.token
    if (token) {
      const idQuest = props.launchQuest?.idQuest
      if (!idQuest) return
      await questStore.getQuest(idQuest, token)
    }
  },
  { deep: true },
)

const { setValues, handleSubmit } = useForm<Quest>({
  validationSchema: {
    example: (value: QuestShort) =>
      Validation.checkIsEmptyValue(value) || 'Выберите шаблон опроса',
    questName: (value: string) =>
      Validation.checkIsEmptyValue(value) || 'Поле не заполнено',
    questDescription: (value: string) =>
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
    <div
      class="modal-360-quest bg-white rounded p-3 container-fluid d-flex flex-column"
    >
      <div class="row d-flex align-items-center justify-content-between w-100">
        <Typography class-name="fs-3 text-primary w-auto">{{
          launchQuest?.name
        }}</Typography>
        <Button
          variant="close"
          class="close"
          @click="emit('close-modal')"
        ></Button>
      </div>
      <div class="d-flex col h-100 justify-content-between">
        <div class="col mb-auto">
          <p>{{ quest?.description }}</p>
        </div>
        <Button
          variant="primary"
          class-name="w-auto h-auto"
          >Начать опрос</Button
        >
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
