<script lang="ts" setup>
import Button from '@Components/Button/Button.vue'
import {
  IdeaFormSubmitProps,
  IdeaFormSubmitEmits,
} from '@Components/Forms/IdeaForm/IdeaFormSubmit.types'

defineProps<IdeaFormSubmitProps>()
const emit = defineEmits<IdeaFormSubmitEmits>()
</script>

<template>
  <div class="d-flex justify-content-center align-items-center">
    <Button
      v-if="idea.status !== 'ON_EDITING'"
      class-name="btn-primary px-5 d-block mx-2"
      @click="emit('on-save-draft')"
    >
      Сохранить
    </Button>

    <Button
      class-name="btn-warning d-block mx-2"
      @click="emit('on-send-on-approval')"
    >
      Отправить на согласование
    </Button>
  </div>
</template>
